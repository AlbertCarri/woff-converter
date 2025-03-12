import { NextResponse } from "next/server";
import ttf2woff from "ttf2woff";
import { compress } from "wawoff2";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file)
    return NextResponse.json(
      { error: "No se recibió archivo" },
      { status: 400 }
    );

  /* 
    Borrar todos los archivos de la carpeta
    converted para que no se llene el bucket
  */
  const { data, error } = await supabase.storage
    .from("fonts")
    .list("converted");

  if (!error && data.length > 0) {
    const filesToRemove = data.map((file) => `converted/${file.name}`);
    const { error: deleteError } = await supabase.storage
      .from("fonts")
      .remove(filesToRemove);
    if (deleteError) console.log("Error al borrar archivos");
  }

  const fontBuffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name.replace(/\.[^/.]+$/, ""); // Quitar la extensión

  // Convertir a WOFF y WOFF2
  const woffBuffer = Buffer.from(ttf2woff(new Uint8Array(fontBuffer)));
  const woff2Buffer = await compress(new Uint8Array(fontBuffer));

  // Subir a Supabase
  await supabase.storage
    .from("fonts")
    .upload(`converted/${fileName}.woff`, woffBuffer);
  await supabase.storage
    .from("fonts")
    .upload(`converted/${fileName}.woff2`, woff2Buffer);

  // leer las URLs de ambos archivos para pasarlos al frontend
  const dataWoff = supabase.storage
    .from("fonts")
    .getPublicUrl(`converted/${fileName}.woff`);
  console.log(dataWoff.data.publicUrl);

  const dataWoff2 = supabase.storage
    .from("fonts")
    .getPublicUrl(`converted/${fileName}.woff2`);
  console.log(dataWoff2.data.publicUrl);

  return NextResponse.json({
    message: "Conversión exitosa",
    fileName: fileName,
    urlWoff: dataWoff.data.publicUrl,
    urlWoff2: dataWoff2.data.publicUrl,
  });
}
