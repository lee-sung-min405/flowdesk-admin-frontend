import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import styles from './rich-text-editor.module.css';

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ align: [] }],
  ['blockquote', 'link', 'image'],
  ['clean'],
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const handleChange = (content: string) => {
    // Quill returns '<p><br></p>' for empty content
    onChange(content === '<p><br></p>' ? '' : content);
  };

  return (
    <div className={styles.editorWrapper}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        modules={{ toolbar: TOOLBAR_OPTIONS }}
      />
    </div>
  );
}
