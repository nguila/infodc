import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-20 h-20",
  md: "w-32 h-32",
  lg: "w-full h-48",
};

const ImageUpload = ({ value, onChange, folder = "geral", label = "Imagem", className = "", size = "md" }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecione um ficheiro de imagem");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem não pode exceder 5MB");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage.from("images").upload(fileName, file);
      if (error) throw error;

      const { data: urlData } = supabase.storage.from("images").getPublicUrl(fileName);
      onChange(urlData.publicUrl);
      toast.success("Imagem carregada com sucesso");
    } catch (err: any) {
      toast.error("Erro ao carregar imagem: " + (err.message || "Erro desconhecido"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (value && value.includes("/storage/v1/object/public/images/")) {
      const path = value.split("/storage/v1/object/public/images/")[1];
      if (path) {
        await supabase.storage.from("images").remove([path]);
      }
    }
    onChange("");
    toast.success("Imagem removida");
  };

  return (
    <div className={className}>
      <p className="text-sm font-medium mb-2">{label}</p>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />

      {value ? (
        <div className={`relative ${sizeMap[size]} rounded-lg overflow-hidden border border-border group`}>
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={() => inputRef.current?.click()} disabled={uploading}>
              <Upload className="w-3 h-3 mr-1" /> Alterar
            </Button>
            <Button type="button" size="sm" variant="destructive" onClick={handleRemove}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`${sizeMap[size]} rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary cursor-pointer`}
        >
          {uploading ? (
            <span className="text-xs animate-pulse">A carregar...</span>
          ) : (
            <>
              <ImageIcon className="w-6 h-6" />
              <span className="text-xs">Carregar imagem</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
