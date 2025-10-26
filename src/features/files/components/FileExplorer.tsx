import { useState, useEffect } from 'react';
import { File, Folder, ChevronRight, ChevronDown, FilePlus, FolderPlus } from 'lucide-react';
import { useEditorStore } from '../../../shared/stores/editorStore';
import { fileSystemService } from '../../../shared/services/filesystem.service';
import type { FileNode } from '../../../shared/types';
import { Button } from '../../../shared/components/atoms/Button';

interface FileTreeItemProps {
  node: FileNode;
  level: number;
}

function FileTreeItem({ node, level }: FileTreeItemProps) {
  const { openFile, loadFiles } = useEditorStore();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(node.name);

  const handleClick = () => {
    if (node.type === 'folder') {
      fileSystemService.toggleFolder(node.id);
      loadFiles();
    } else {
      openFile(node.id);
    }
  };

  const handleRename = () => {
    if (newName && newName !== node.name) {
      fileSystemService.renameFile(node.id, newName);
      loadFiles();
    }
    setIsRenaming(false);
  };


  return (
    <div>
      <div
        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-700 cursor-pointer text-gray-300 text-sm"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
        onDoubleClick={() => node.type === 'file' && setIsRenaming(true)}
      >
        {node.type === 'folder' && (
          <span className="flex-shrink-0">
            {node.isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
        {node.type === 'folder' ? (
          <Folder size={16} className="flex-shrink-0 text-blue-400" />
        ) : (
          <File size={16} className="flex-shrink-0 text-gray-400" />
        )}
        {isRenaming ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') setIsRenaming(false);
            }}
            className="bg-gray-800 border border-blue-500 rounded px-1 flex-1 text-white text-sm focus:outline-none"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex-1 truncate">{node.name}</span>
        )}
      </div>

      {node.type === 'folder' && node.isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer() {
  const { files, loadFiles } = useEditorStore();
  const [showNewFile, setShowNewFile] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  const handleCreateFile = () => {
    if (newItemName) {
      fileSystemService.createFile(newItemName, null);
      loadFiles();
      setNewItemName('');
      setShowNewFile(false);
    }
  };

  const handleCreateFolder = () => {
    if (newItemName) {
      fileSystemService.createFolder(newItemName, null);
      loadFiles();
      setNewItemName('');
      setShowNewFolder(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  return (
    <div className="h-full bg-gray-800 flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-gray-700">
        <span className="text-xs font-semibold text-gray-400 uppercase">Explorer</span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNewFile(true)}
            title="New File"
            className="p-1"
          >
            <FilePlus size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNewFolder(true)}
            title="New Folder"
            className="p-1"
          >
            <FolderPlus size={16} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showNewFile && (
          <div className="p-2">
            <input
              type="text"
              placeholder="filename.ext"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onBlur={handleCreateFile}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFile();
                if (e.key === 'Escape') {
                  setShowNewFile(false);
                  setNewItemName('');
                }
              }}
              className="w-full bg-gray-900 border border-blue-500 rounded px-2 py-1 text-white text-sm focus:outline-none"
              autoFocus
            />
          </div>
        )}

        {showNewFolder && (
          <div className="p-2">
            <input
              type="text"
              placeholder="folder name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onBlur={handleCreateFolder}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFolder();
                if (e.key === 'Escape') {
                  setShowNewFolder(false);
                  setNewItemName('');
                }
              }}
              className="w-full bg-gray-900 border border-blue-500 rounded px-2 py-1 text-white text-sm focus:outline-none"
              autoFocus
            />
          </div>
        )}

        {files.map((node) => (
          <FileTreeItem key={node.id} node={node} level={0} />
        ))}
      </div>
    </div>
  );
}
