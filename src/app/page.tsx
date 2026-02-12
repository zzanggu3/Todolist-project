"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Todo {
  id: string;
  name: string;
  isCompleted: boolean;
}

const BASE_URL = "https://assignment-todolist-api.vercel.app/api/zzanggu";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const router = useRouter();
  const [input, setInput] = useState("");
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 480;
  const isTablet = windowWidth > 480 && windowWidth <= 768;

  const loadTodos = async () => {
    const res = await fetch(`${BASE_URL}/items`);
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAdd = async () => {
    if (!input.trim()) return;

    await fetch(`${BASE_URL}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: input }),
    });

    setInput("");
    loadTodos();
  };

  const handleToggle = async (todo: Todo) => {
    await fetch(`${BASE_URL}/items/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: !todo.isCompleted }),
    });
    loadTodos();
  };

  const active = todos.filter((t) => !t.isCompleted);
  const completed = todos.filter((t) => t.isCompleted);

  return (
    <div style={{ backgroundColor: "#F1F5F9", minHeight: "100vh" }}>
      <main
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: 20,
          fontFamily: "NanumSquareR",
        }}
      >
        {/* 입력창 */}
        <div style={{
          display: "flex",
          gap: 10,
          marginBottom: 50,
          alignItems: "center"
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="할 일을 입력해주세요"
            style={{
              flex: 1,
              padding: isMobile ? "6px 10px" : "10px 16px",
              borderRadius: 9999,
              border: "1px solid #000",
              borderBottomWidth: 4,
              borderRightWidth: 4,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              outline: "none",
              fontFamily: "NanumSquareR",
              fontSize: isMobile ? 14 : 16,
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <button
            onClick={handleAdd}
            style={{
              padding: isMobile ? "6px 10px" : "10px 20px",
              borderRadius: 9999,
              backgroundColor: "#E2E8F0",
              border: "1px solid #000",
              borderBottomWidth: 4,
              borderRightWidth: 4,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              cursor: "pointer",
              fontFamily: "NanumSquareB",
              fontWeight: 700,
              fontSize: isMobile ? 16 : 14,
            }}
          >
            {isMobile ? "+" : "+ 추가하기"}
          </button>
        </div>

        {/* TO / DONE 버튼 */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <div
            style={{
              width: 100,
              padding: 8,
              borderRadius: 9999,
              backgroundColor: "#BEF264",
              textAlign: "center",
              fontFamily: "NanumSquareB",
              fontWeight: 700,
              color: "#15803D",
              border: "2px solid #000"

            }}
          >
            TO DO
          </div>
          <div
            style={{
              width: 100,
              padding: 8,
              borderRadius: 9999,
              backgroundColor: "#15803D",
              textAlign: "center",
              fontFamily: "NanumSquareB",
              fontWeight: 700,
              color: "#FCD34D",
              border: "2px solid #000",
              marginLeft: 480,
            }}
          >
            DONE
          </div>
        </div>

        {/* TO / DONE 리스트 좌우 컬럼 */}
        <div style={{ display: "flex", gap: 20 }}>
          {/* TO LIST */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch", justifyContent: active.length === 0 ? "center" : "flex-start" }}>
            {active.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: 20 }}>
                <img
                  src="images\pencel.png" // TODO 아이콘
                  alt="할 일이 없습니다"
                  style={{ width: 120, height: 120, objectFit: "contain" }}
                />
                <span style={{ fontFamily: "NanumSquareR", fontSize: 16, color: "#555", textAlign: "center" }}>
                  할 일을 새롭게 추가해주세요.
                </span>
              </div>
            ) :
              active.map((todo) => (
                <div
                  key={todo.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: 10,
                    borderRadius: 9999,
                    backgroundColor: "#FFFFFF",
                    border: "2px solid #000",
                  }}
                >
                  {/* 체크박스 클릭 시 완료 */}
                  <div
                    onClick={() => handleToggle(todo)}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: "#FEFCE8",
                      border: "2px solid #000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  ></div>

                  {/* 글 클릭 시 수정페이지 */}
                  <span
                    onClick={() => router.push(`/items/${todo.id}`)}
                    style={{ fontFamily: "NanumSquareR", cursor: "pointer" }}
                  >
                    {todo.name}
                  </span>
                </div>
              ))}
          </div>

          {/* DONE LIST */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch", justifyContent: completed.length === 0 ? "center" : "flex-start" }}>
            {completed.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: 20 }}>
                <img
                  src="\images\water.png" // DONE 아이콘
                  alt="아직 완료된 일이 없습니다"
                  style={{ width: 120, height: 120, objectFit: "contain" }}
                />
                <span style={{ fontFamily: "NanumSquareR", fontSize: 16, color: "#555", textAlign: "center" }}>
                  아직 다 한 일이 없어요. 해야할 일을 체크해보세요!
                </span>
              </div>
            ) :


              completed.map((todo) => (
                <div
                  key={todo.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: 10,
                    borderRadius: 9999,
                    backgroundColor: "#EDE9FE",
                    border: "2px solid #000"
                  }}
                >
                  {/* 체크박스 클릭 시 TO로 이동 */}
                  <div
                    onClick={() => handleToggle(todo)}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: "#7C3AED",
                      border: "2px solid #000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    ✓
                  </div>
                  <span
                    onClick={() => router.push(`/items/${todo.id}`)}
                    style={{
                      textDecoration: "line-through",
                      fontFamily: "NanumSquareR",
                      cursor: "pointer",
                    }}
                  >
                    {todo.name}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
