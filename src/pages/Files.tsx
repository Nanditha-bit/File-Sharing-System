import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Navbar from "@/components/Navbar";
import { FileText, Search, Download, Share2, Eye, Trash2, Loader2, MessageCircle, Mail, Send, Copy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FileData {
  id: string;
  filename: string;
  file_size: number;
  cid: string;
  created_at: string;
  blockchain_verified: boolean;
}

const Files = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuthAndFetchFiles = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      
      await fetchFiles();
    };

    checkAuthAndFetchFiles();
  }, [navigate]);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load files");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFiles = files.filter((file) =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.cid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (fileId: string, fileName: string) => {
    try {
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Delete from storage - try with timestamp prefix pattern
      const { data: storageFiles } = await supabase.storage
        .from('user-files')
        .list(session.user.id);

      const fileToDelete = storageFiles?.find(f => f.name.includes(fileName));
      
      if (fileToDelete) {
        await supabase.storage
          .from('user-files')
          .remove([`${session.user.id}/${fileToDelete.name}`]);
      }

      // Delete from database
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;
      
      toast.success(`${fileName} deleted successfully`);
      await fetchFiles();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete file");
    }
  };

  const handleDownload = async (file: FileData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // List files to find the one with timestamp
      const { data: storageFiles } = await supabase.storage
        .from('user-files')
        .list(session.user.id);

      const fileToDownload = storageFiles?.find(f => f.name.includes(file.filename));
      
      if (!fileToDownload) {
        toast.error("File not found in storage");
        return;
      }

      const { data, error } = await supabase.storage
        .from('user-files')
        .download(`${session.user.id}/${fileToDownload.name}`);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("File downloaded!");
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(error.message || "Failed to download file");
    }
  };

  const handleShare = (file: FileData, platform: string) => {
    const fileUrl = `${window.location.origin}/verify?cid=${file.cid}`;
    const text = `Check out my file: ${file.filename}`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${fileUrl}`)}`, '_blank');
        break;
      case 'gmail':
        window.open(`https://mail.google.com/mail/?view=cm&su=${encodeURIComponent(file.filename)}&body=${encodeURIComponent(`${text}\n\n${fileUrl}`)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(fileUrl)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(fileUrl);
        toast.success("Link copied to clipboard!");
        break;
      default:
        break;
    }
  };

  const handleView = (file: FileData) => {
    navigate(`/verify?cid=${file.cid}`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Files</h1>
          <p className="text-muted-foreground">
            Manage and verify your decentralized files
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by filename or CID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Files List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Loading files...</p>
              </CardContent>
            </Card>
          ) : filteredFiles.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? "No files match your search" : "No files uploaded yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredFiles.map((file) => (
              <Card key={file.id} className="hover:border-primary/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{file.filename}</h3>
                          <Badge 
                            variant={file.blockchain_verified ? "default" : "secondary"}
                            className="flex-shrink-0"
                          >
                            {file.blockchain_verified ? "verified" : "pending"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.file_size)} • Uploaded {formatDate(file.created_at)}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono mt-1 truncate">
                          CID: {file.cid}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(file)}
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(file)}
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" title="Share">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleShare(file, 'whatsapp')}>
                            <MessageCircle className="w-4 h-4 mr-2" />
                            WhatsApp
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare(file, 'gmail')}>
                            <Mail className="w-4 h-4 mr-2" />
                            Gmail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare(file, 'telegram')}>
                            <Send className="w-4 h-4 mr-2" />
                            Telegram
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare(file, 'copy')}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(file.id, file.filename)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Files;
