import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AuthLayout from "../components/layout/AuthLayout";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    birthdate: "",
    gender: "",
    phone: "",
  });
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");
    if (!form.name || !form.email || !form.password || !form.birthdate || !form.gender || !form.phone) {
      setError("모든 필드를 채워주세요.");
      return;
    }
    if (form.password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }
    const birthYear = new Date(form.birthdate).getFullYear();
    if (isNaN(birthYear) || birthYear < 1900 || birthYear > new Date().getFullYear()) {
      setError("유효한 생년월일을 입력해주세요.");
      return;
    }

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      alert("회원가입 완료! 로그인 해주세요.");
      router.push("/login");
    } else {
      setError(data.message || "회원가입 실패");
    }
  };

  return (
    <AuthLayout title="회원가입">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-green-600 mb-6">회원가입</h1>

        <input
          type="text"
          placeholder="이름"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-3 mb-4"
        />
        <input
          type="email" 
          placeholder="이메일" 
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-3 mb-4"
        />

        <input
          type="password"
          placeholder="비밀번호 (4자리 이상 입력해주세요.)" 
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-3 mb-4"
        />

        <input
          type="date"
          value={form.birthdate}
          onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
      
          min="1900-01-01" 
          max={new Date().toISOString().split('T')[0]} 
          className="w-full border border-gray-300 rounded-md p-3 mb-4"
        />

        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-3 mb-4"
        >
          <option value="">성별 선택</option>
          <option value="남성">남성</option>
          <option value="여성">여성</option>
          <option value="비공개">비공개</option>
        </select>

        <input
          type="tel"
          placeholder="전화번호 (예: 010-1234-5678)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-3 mb-6"
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSignup}
          className="w-full bg-green-600 text-white font-semibold py-3 rounded-md hover:bg-green-700 transition"
        >
          회원가입
        </button>

        <p className="text-sm text-gray-600 text-center mt-6">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-blue-500 font-medium hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}