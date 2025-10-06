import { ACCEPTED_FILE_EXTENSIONS, useDocumentDropzone } from './hooks/useDocumentDropzone';

export default function DocumentDropzone() {
  const { files, dragActive, inputRef, onDrop, onDragOver, onDragLeave, onClick, onFileChange } =
    useDocumentDropzone();

  return (
    <div
      className={`border-2 border-dashed p-4 rounded transition-colors ${
        dragActive ? 'border-blue-400 bg-blue-50' : 'border-red-100 bg-white'
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_FILE_EXTENSIONS}
        className="hidden"
        onChange={onFileChange}
      />
      <button
        type="button"
        onClick={onClick}
        className="w-full flex flex-col items-center justify-center min-h-[100px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
      >
        <span className="font-semibold text-gray-700">
          Drag & drop files here, or click to select
        </span>
        <span className="text-xs text-gray-400 mt-1">Allowed: PNG, JPEG, JPG, PDF, DOCX, TXT</span>
      </button>
      {files.length > 0 && (
        <div className="mt-4">
          <div className="font-medium mb-2">Uploaded Files:</div>
          <ul className="space-y-1">
            {files.map((file) => (
              <li
                key={`${file.name}-${file.size}`}
                className="text-sm text-gray-600 flex items-center gap-2"
              >
                <span className="font-semibold">{file.name}</span>
                <span className="text-xs text-gray-400">
                  ({file.type}, {(file.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
                {/* Optionally show preview for images */}
                {file.type.startsWith('image/') && (
                  <img
                    src={file.base64}
                    alt={file.name}
                    className="w-8 h-8 object-cover rounded ml-2"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
