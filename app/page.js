"use client";

import { useActionState, useState } from "react";
import { Upload, Download, Github } from "@/utils/svg";
import { BoxLoading } from "@/components/BoxLoading";

async function sendFile(prevState, formData) {
  const file = formData.get("file");
  try {
    const response = await fetch("/api/woff-convertion", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    return {
      success: true,
      message: "Convertion success!",
      fileName: data.fileName,
      urlWoff: data.urlWoff,
      urlWoff2: data.urlWoff2,
    };
  } catch (error) {
    return { success: false, message: error };
  }
}

export default function Home() {
  const [fileLoad, setFileLoad] = useState("");
  const [state, sendForm, isPending] = useActionState(sendFile, {
    success: null,
    message: "",
    fileName: "",
    urlWoff: "",
    urlWoff2: "",
  });

  function fileUpload(e) {
    setFileLoad(e.target.files[0].name);
  }

  return (
    <div className="w-96 flex flex-col min-h-screen  items-center">
      <div className="flex-grow">
        <p className="text-3xl text-fuchsia-600 mt-4 text-center">
          .ttf to .woff/.woff2
        </p>
        <p className="text-5xl text-fuchsia-600 mt-2 text-center">CONVERTER</p>
        <form action={sendForm} className="flex flex-col mt-4">
          <label
            htmlFor="file"
            className="flex bg-slate-800 text-blue-50 w-80 h-40 text-2xl rounded-2xl hover:bg-slate-600 cursor-pointer border-2 border-gray-400 justify-center p-14"
          >
            {fileLoad !== "" ? fileLoad : <Upload />}
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={fileUpload}
            className="text-center text-xs"
            style={{ display: "none" }}
          />
          <button
            type="submit"
            className="bg-amber-500 text-3xl p-2 text-black rounded-2xl hover:bg-amber-700 cursor-pointer mt-4 border-2 border-gray-900 shadow-lg shadow-gray-900"
          >
            {isPending ? "Converting...." : "Click to convert"}
          </button>
        </form>
        {isPending && <BoxLoading />}
        {state.success !== null && !isPending && (
          <>
            <p className="text-2xl mt-4 text-center">
              {state.success ? "Convertion Sucsess👍" : "Convertion Fail👎"}
            </p>
            <a
              href={state.urlWoff}
              className={`${
                state.success ? "bg-blue-600 hover:bg-sky-600 " : "bg-red-600"
              } flex items-center justify-center gap-4 text-cyan-50 w-80 text-center text-lg p-2 rounded-2xl mt-6 border-2 border-gray-900 shadow-lg shadow-gray-900 `}
            >
              <Download /> {state.fileName}.woff
            </a>
            <a
              href={state.urlWoff2}
              className={`${
                state.success ? "bg-blue-700 hover:bg-sky-700" : "bg-red-700"
              } flex items-center justify-center gap-4 text-cyan-50 w-80 text-center text-lg p-2 rounded-2xl mt-6 border-2 border-gray-900 shadow-lg shadow-gray-900`}
            >
              <Download /> {state.fileName}.woff2
            </a>
          </>
        )}
      </div>
      <footer className="flex flex-row items-center mb-4 gap-4 text-2xl">
        <a href="https://github.com/AlbertCarri" target="blank">
          <Github />
        </a>
        <p>Alberto Edelmiro Carrizo</p>
      </footer>
    </div>
  );
}
