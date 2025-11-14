import { Editor } from "@tiptap/react"
import {
  Bold, Italic, Underline,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code,
  AlignLeft, AlignCenter, AlignRight,
  Undo, Redo
} from "lucide-react"

export const TiptapToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-700 bg-gray-800 rounded-t-lg">
      {/* Text Formatting */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive("bold") ? "bg-gray-700 text-primary" : "text-gray-300"
        }`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive("italic") ? ":bg-gray-700 text-primary" : "text-gray-300"
        }`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive("underline") ? ":bg-gray-700 text-primary" : "text-gray-300"
        }`}
        title="Underline"
      >
        <Underline className="w-4 h-4" />
      </button>

      <div className="h-6 w-px bg-gray-700 mx-1"></div>

      {/* Headings */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive("heading", { level: 1 }) ? ":bg-gray-700 text-primary" : "text-gray-300"
        }`}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive("heading", { level: 2 }) ? ":bg-gray-700 text-primary" : "text-gray-300"
        }`}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive("heading", { level: 3 }) ? ":bg-gray-700 text-primary" : "text-gray-300"
        }`}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="h-6 w-px bg-gray-700 mx-1"></div>

      {/* Lists & Blocks */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive("bulletList") ? ":bg-gray-700 text-primary" : "text-gray-300"
        }`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive("orderedList") ? ":bg-gray-700 text-primary" : "text-gray-300"
        }`}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive("blockquote") ? ":bg-gray-700 text-primary" : "text-gray-300"
        }`}
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive("codeBlock") ? ":bg-gray-700 text-primary" : "text-gray-300"
        }`}
        title="Code Block"
      >
        <Code className="w-4 h-4" />
      </button>

      <div className="h-6 w-px bg-gray-700 mx-1"></div>

      {/* Alignment */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive({ textAlign: "left" }) ? ":bg-gray-700 text-primary" : "text-gray-300"
        }`}
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive({ textAlign: "center" }) ? ":bg-gray-700 text-primary" : "text-gray-300"
        }`}
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`p-2 rounded hover:bg-gray-700 ${
          editor.isActive({ textAlign: "right" }) ? ":bg-gray-700 text-primary" : "text-gray-300"
        }`}
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </button>

      <div className="h-6 w-px bg-gray-700 mx-1"></div>

      {/* History */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded hover:bg-gray-700 disabled:opacity-50 text-gray-300"
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded hover:bg-gray-700 disabled:opacity-50 text-gray-300"
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  )
}