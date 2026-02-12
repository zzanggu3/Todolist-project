"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Todo {
  id: string;
  name: string;
  isCompleted: boolean;
  memo?: string;
  imageUrl?: string;
}

const BASE_URL =
  "https://assignment-todolist-api.vercel.app/api/zzanggu";

// 재사용 가능한 이미지 업로더 컴포넌트
interface ImageUploaderProps {
  imageUrl?: string;
  onFileSelect: (file: File) => void;
}

function ImageUploader({ imageUrl, onFileSelect }: ImageUploaderProps) {
  const handleClick = () => document.getElementById("imageInput")?.click();
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  useEffect(() => {
    if (!previewFile) return;
    const url = URL.createObjectURL(previewFile);
    return () => URL.revokeObjectURL(url);
  }, [previewFile]);

  return (
    <div className="relative w-full h-80 md:w-96 md:h-80 bg-gray-50 border-2 border-dashed rounded-lg flex justify-center items-center">
      {imageUrl && !previewFile ? (
        <img
          src={imageUrl}
          alt="첨부 이미지"
          className="w-full h-full object-contain rounded-md"
        />
      ) : previewFile ? (
        <img
          src={URL.createObjectURL(previewFile)}
          alt="첨부 이미지"
          className="w-full h-full object-contain rounded-md"
        />
      ) : (
        <img src="/images/img.png" alt="추가 아이콘" className="w-16 h-16" />
      )}

      <button
  type="button"
  onClick={handleClick}
  className="absolute bottom-2 right-2 w-16 h-16 rounded-full bg-gray-200 text-black text-2xl font-bold flex justify-center items-center"
>
  {imageUrl || previewFile ? (
    <img
      src="/images/Type=Edit@3x.png" // 연필 아이콘
      alt="연필 아이콘"
      className="w-16 h-16"
    />
  ) : (
    <span className="text-2xl font-bold">+</span> // 기존 +
  )}
</button>

      <input
        id="imageInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > 5 * 1024 * 1024) {
            alert("파일 크기는 5MB 이하만 가능합니다.");
            return;
          }
          const isEnglish = /^[a-zA-Z0-9_.-]+$/.test(file.name);
          if (!isEnglish) {
            alert("파일 이름은 영어로만 작성해주세요.");
            return;
          }
          setPreviewFile(file);
          onFileSelect(file);
        }}
      />
    </div>
  );
}

export default function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [name, setName] = useState("");
  const [memo, setMemo] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const load = async () => {
      const { id } = await params;
      const res = await fetch(`${BASE_URL}/items/${id}`);
      const data = await res.json();
      setTodo(data);
      setName(data.name);
      setMemo(data.memo || "");
    };

    load();
  }, [params]);

  const handleToggleCompleted = async () => {
    if (!todo) return;
    const updated = { ...todo, isCompleted: !todo.isCompleted };

    await fetch(`${BASE_URL}/items/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isCompleted: updated.isCompleted,
        name: updated.name,
        memo: updated.memo || "",
      }),
    });

    setTodo(updated);
  };

  const handleUpdate = async () => {
    if (!todo) return;

    await fetch(`${BASE_URL}/items/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        memo,
        isCompleted: todo.isCompleted,
        imageUrl: imageFile ? URL.createObjectURL(imageFile) : todo.imageUrl,
      }),
    });

    router.push("/");
  };

  const handleDelete = async () => {
    if (!todo) return;

    await fetch(`${BASE_URL}/items/${todo.id}`, { method: "DELETE" });
    router.push("/");
  };

  if (!todo) return <div className="p-5">로딩중...</div>;

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center pb-5">
      <div className="w-full max-w-5xl min-h-[1020px] bg-white p-5 rounded-lg shadow-lg flex flex-col gap-5">
        {/* 상단: 할 일 이름 */}
        <div
          className={`flex items-center justify-center w-full p-2 rounded-full border-2 gap-2 ${
            todo.isCompleted ? "bg-purple-100 border-black" : "bg-white border-black"
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-bold ${
                todo.isCompleted ? "bg-purple-700 text-white" : "bg-yellow-100 text-transparent"
              }`}
            >
              {todo.isCompleted ? "✓" : ""}
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`font-bold text-lg bg-transparent outline-none border-none text-center ${
                todo.isCompleted ? "line-through underline" : "underline"
              }`}
            />
          </div>
        </div>

        {/* 이미지 + 메모 영역 */}
        <div className="flex flex-col md:flex-row gap-5 justify-center items-start">
          <ImageUploader imageUrl={todo.imageUrl} onFileSelect={setImageFile} />

          {/* 메모장 */}
          <div className="relative w-full max-w-md">
            <img src="/images/memo@3x.png" alt="memo background" className="w-full h-[311px] object-cover" />
            <h2 className="absolute top-4 left-1/2 -translate-x-1/2 text-[#92400E] font-bold text-lg">
              Memo
            </h2>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="absolute top-16 left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-transparent resize-none outline-none"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={handleUpdate}
                className="bg-gray-200 border border-black border-b-4 border-r-4 shadow-md px-4 py-2 rounded-full font-semibold cursor-pointer"
              >
                수정 완료
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white border border-black border-b-4 border-r-4 shadow-md px-4 py-2 rounded-full font-semibold cursor-pointer"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
