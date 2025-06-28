# filename: crawl_fablecottage.py

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from deep_translator import GoogleTranslator
import requests
import time
import re

base_url = "https://www.thefablecottage.com"
main_url = base_url
save_api = "http://localhost:3000/api/save-crawled-story"

# 셀레니움 옵션
options = Options()
options.add_argument("--headless")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
driver = webdriver.Chrome(options=options)

# 제목 괄호 제거
def clean_title(title: str) -> str:
    return re.sub(r"\s*\(.*?\)", "", title).strip()

# 긴 텍스트도 처리 가능한 번역 함수
def translate_long_text(text: str) -> str:
    try:
        if len(text) < 4900:
            return GoogleTranslator(source="auto", target="ko").translate(text)

        chunks = []
        paragraphs = text.split('\n')
        buffer = ""

        for para in paragraphs:
            if len(buffer) + len(para) < 4800:
                buffer += para + "\n"
            else:
                translated = GoogleTranslator(source="auto", target="ko").translate(buffer.strip())
                time.sleep(1)  # 번역 또는 저장 후
                chunks.append(translated)
                buffer = para + "\n"

        if buffer.strip():
            translated = GoogleTranslator(source="auto", target="ko").translate(buffer.strip())
            chunks.append(translated)

        return "\n\n".join(chunks)

    except Exception as e:
        print(f"❌ 번역 오류 (긴 텍스트): {e}")
        return ""

# 스토리 저장 (재시도 포함)
def save_story(title_ko, content_ko):
    if not title_ko or not content_ko:
        print("⚠️ 저장할 데이터 부족. 스킵")
        return
    try:
        res = requests.post(save_api, json={"titleKo": title_ko, "contentKo": content_ko}, timeout=10)
        if res.status_code == 200:
            print(f"✅ 저장 성공: {title_ko}")
        else:
            print(f"❌ 1차 저장 실패: {res.status_code} - {res.text}")
            time.sleep(1)
            # 재시도
            res = requests.post(save_api, json={"titleKo": title_ko, "contentKo": content_ko}, timeout=10)
            if res.status_code == 200:
                print(f"✅ 2차 시도 저장 성공: {title_ko}")
            else:
                print(f"❌ 2차 시도도 실패: {res.status_code} - {res.text}")
    except Exception as e:
        print(f"❌ 저장 중 예외 발생: {e}")

# 목록에서 링크 수집
def crawl_fable_links():
    print(f"🌐 크롤링 시작: {main_url}")
    driver.get(main_url)

    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "div.index-item a.index-item-img"))
    )

    link_elements = driver.find_elements(By.CSS_SELECTOR, "div.index-item a.index-item-img")
    links = []

    for e in link_elements:
        href = e.get_attribute("href")
        if href:
            links.append(href if href.startswith("http") else base_url + href)

    print(f"🔗 수집된 동화 링크 수: {len(links)}")
    return links

# 동화 페이지 크롤링 및 저장
def extract_and_save_story(link):
    print(f"\n🚀 동화 접속: {link}")
    try:
        driver.get(link)
        time.sleep(2)

        title_en = driver.title.replace(" — Fable Cottage", "").strip()
        title_en = clean_title(title_en)
        title_ko = translate_long_text(title_en)

        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "p")))
        paragraphs = driver.find_elements(By.TAG_NAME, "p")
        content_en = "\n".join(p.text for p in paragraphs if p.text.strip())
        content_ko = translate_long_text(content_en)

        save_story(title_ko, content_ko)

    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        driver.save_screenshot("error_page.png")

# 전체 실행
def main():
    links = crawl_fable_links()
    for link in links:
        extract_and_save_story(link)
        time.sleep(3)

    driver.quit()
    print("\n🏁 전체 크롤링 완료.")

if __name__ == "__main__":
    main()
