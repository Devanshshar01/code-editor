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
        className="flex items-center gap-1 px-2 py-0.5 hover:bg-[#2a2d2e] cursor-pointer text-[#cccccc] text-xs"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
        onDoubleClick={() => node.type === 'file' && setIsRenaming(true)}
      >
        {node.type === 'folder' && (
          <span className="flex-shrink-0">
            {node.isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </span>
        )}
        {node.type === 'folder' ? (
          <Folder size={12} className="flex-shrink-0 text-[#dcb67a]" />
        ) : (
          <File size={12} className="flex-shrink-0 text-[#519aba]" />
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
            className="bg-[#3c3c3c] border border-[#007acc] rounded px-1 flex-1 text-white text-xs focus:outline-none"
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
    <div className="h-full bg-[#1e1e1e] flex flex-col">
      <div className="flex items-center justify-between px-3 py-1 border-b border-[#1e1e1e] bg-[#252526]">
        <span className="text-xs font-medium text-[#cccccc] uppercase tracking-wide">Explorer</span>
        <div className="flex gap-0.5">
          <Button
            variant="secondary"
            size="xs"
            onClick={() => setShowNewFile(true)}
            title="New File"
          >
            <FilePlus size={12} />
          </Button>
          <Button
            variant="secondary"
            size="xs"
            onClick={() => setShowNewFolder(true)}
            title="New Folder"
          >
            <FolderPlus size={12} />
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
              className="w-full bg-[#3c3c3c] border border-[#007acc] rounded px-2 py-0.5 text-white text-xs focus:outline-none"
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
              className="w-full bg-[#3c3c3c] border border-[#007acc] rounded px-2 py-0.5 text-white text-xs focus:outline-none"
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