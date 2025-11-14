import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { TiptapToolbar } from './tiptap-toolbar'

export function TiptapEditor({
  content,
  onChange,
}: {
  content: string
  onChange: (content: string) => void
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-gray-100 dark:bg-gray-800 rounded-md p-3 font-mono',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic',
          },
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert p-4 min-h-[400px] focus:outline-none max-w-none',
      },
    },
  })

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 dark:bg-gray-900 shadow-sm overflow-hidden">
      <TiptapToolbar editor={editor} />
      <EditorContent editor={editor} className="transition-colors duration-200" />
    </div>
  )
}