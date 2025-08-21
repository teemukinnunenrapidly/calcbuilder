'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  Download, 
  Trash2, 
  Eye, 
  FileText, 
  Image, 
  Palette,
  Plus,
  RefreshCw,
  X,
  AlertCircle
} from 'lucide-react';
import { Company } from '@/types';

interface CompanyAsset {
  id: string;
  name: string;
  type: string;
  size: number;
  mime_type: string;
  created_at: string;
  updated_at: string;
  url: string;
  description?: string;
}

interface AssetUploadForm {
  file: File | null;
  type: string;
  description: string;
}

const ASSET_TYPES = [
  { value: 'logo', label: 'Company Logo', icon: Palette, maxSize: '5MB' },
  { value: 'banner', label: 'Banner Image', icon: Image, maxSize: '10MB' },
  { value: 'icon', label: 'Favicon/Icon', icon: Image, maxSize: '2MB' },
  { value: 'document', label: 'Document', icon: FileText, maxSize: '25MB' },
  { value: 'image', label: 'General Image', icon: Image, maxSize: '15MB' }
];

export default function CompanyAssetsPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [assets, setAssets] = useState<CompanyAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedAssetType, setSelectedAssetType] = useState<string>('all');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadForm, setUploadForm] = useState<AssetUploadForm>({
    file: null,
    type: 'logo',
    description: ''
  });
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    loadCompanyData();
  }, [selectedAssetType]);

  const loadCompanyData = async () => {
    setIsLoading(true);
    try {
      // Load company profile
      const companyResponse = await fetch('/api/companies');
      const companyData = await companyResponse.json();

      if (companyData.success && companyData.data && companyData.data.length > 0) {
        const companyInfo = companyData.data[0];
        setCompany(companyInfo);
        
        // Load company assets
        await loadCompanyAssets(companyInfo.id);
      }
    } catch (error) {
      console.error('Error loading company data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompanyAssets = async (companyId: string) => {
    try {
      const url = selectedAssetType === 'all' 
        ? `/api/companies/${companyId}/assets`
        : `/api/companies/${companyId}/assets?type=${selectedAssetType}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setAssets(data.data.assets || []);
      } else {
        console.error('Error loading assets:', response.statusText);
        setAssets([]);
      }
    } catch (error) {
      console.error('Error loading assets:', error);
      setAssets([]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file }));
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl('');
      }
    }
  };

  const handleAssetTypeChange = (value: string) => {
    setUploadForm(prev => ({ ...prev, type: value }));
  };

  const handleUpload = async () => {
    if (!uploadForm.file || !company) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('type', uploadForm.type);
      formData.append('description', uploadForm.description);

      const response = await fetch(`/api/companies/${company.id}/assets`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to upload asset');
      }

      // Reset form
      setUploadForm({
        file: null,
        type: 'logo',
        description: ''
      });
      setPreviewUrl('');
      setShowUploadForm(false);

      // Reload assets
      await loadCompanyAssets(company.id);

      alert('Asset uploaded successfully!');
    } catch (error) {
      console.error('Error uploading asset:', error);
      alert(`Error uploading asset: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteAsset = async (asset: CompanyAsset) => {
    if (!company) return;

    if (!confirm(`Are you sure you want to delete "${asset.name}"?`)) {
      return;
    }

    try {
      // Extract file path from URL or use asset ID
      const filePath = asset.url.split('/').slice(-2).join('/'); // Get folder/filename from URL
      
      const response = await fetch(`/api/companies/${company.id}/assets?path=${filePath}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete asset');
      }

      // Reload assets
      await loadCompanyAssets(company.id);

      alert('Asset deleted successfully!');
    } catch (error) {
      console.error('Error deleting asset:', error);
      alert(`Error deleting asset: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getAssetTypeIcon = (type: string) => {
    const assetType = ASSET_TYPES.find(t => t.value === type);
    return assetType ? <assetType.icon className="h-4 w-4" /> : <FileText className="h-4 w-4" />;
  };

  const getAssetTypeLabel = (type: string) => {
    const assetType = ASSET_TYPES.find(t => t.value === type);
    return assetType ? assetType.label : type;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Company Assets</h1>
        <p className="text-gray-600 mt-2">
          Manage your company&apos;s digital assets including logos, images, and documents
        </p>
      </div>

      {/* Asset Type Filter */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <Select value={selectedAssetType} onValueChange={setSelectedAssetType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assets</SelectItem>
              {ASSET_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => setShowUploadForm(true)}
            className="ml-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Asset
          </Button>
        </div>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Upload New Asset</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUploadForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              Upload a new asset to your company&apos;s asset library
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assetType">Asset Type</Label>
                <Select value={uploadForm.type} onValueChange={handleAssetTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSET_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <type.icon className="h-4 w-4" />
                          <span>{type.label}</span>
                          <Badge variant="secondary" className="text-xs">
                            Max {type.maxSize}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept={ASSET_TYPES.find(t => t.value === uploadForm.type)?.value === 'document' 
                    ? '.pdf,.doc,.docx'
                    : 'image/*'
                  }
                  disabled={isUploading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={uploadForm.description}
                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this asset..."
                rows={3}
                disabled={isUploading}
              />
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="flex items-center space-x-4">
                  <img
                    src={previewUrl}
                    alt="Asset preview"
                    className="w-20 h-20 object-contain border rounded-lg"
                  />
                  <div className="text-sm text-gray-600">
                    <p><strong>File:</strong> {uploadForm.file?.name}</p>
                    <p><strong>Size:</strong> {uploadForm.file ? formatFileSize(uploadForm.file.size) : ''}</p>
                    <p><strong>Type:</strong> {uploadForm.file?.type}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowUploadForm(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!uploadForm.file || isUploading}
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Asset
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <Card key={asset.id} className="overflow-hidden">
            {/* Asset Preview */}
            <div className="aspect-video bg-gray-100 flex items-center justify-center relative group">
              {asset.mime_type.startsWith('image/') ? (
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <FileText className="h-12 w-12 mb-2" />
                  <span className="text-sm">{asset.mime_type.split('/')[1].toUpperCase()}</span>
                </div>
              )}
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(asset.url, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(asset.url, '_blank')}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteAsset(asset)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Asset Info */}
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getAssetTypeIcon(asset.type)}
                  <Badge variant="outline" className="text-xs">
                    {getAssetTypeLabel(asset.type)}
                  </Badge>
                </div>
              </div>

              <h3 className="font-medium text-gray-900 mb-1 truncate" title={asset.name}>
                {asset.name}
              </h3>

              {asset.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {asset.description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatFileSize(asset.size)}</span>
                <span>{formatDate(asset.created_at)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {assets.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Image className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
                <p className="text-gray-600 mb-4">
                  {selectedAssetType === 'all' 
                    ? "You haven't uploaded any assets yet."
                    : `No ${getAssetTypeLabel(selectedAssetType).toLowerCase()} assets found.`
                  }
                </p>
                <Button onClick={() => setShowUploadForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Your First Asset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Storage Usage Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Storage Information
          </CardTitle>
          <CardDescription>
            Monitor your company&apos;s storage usage and limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {assets.length}
              </div>
              <div className="text-sm text-gray-600">Total Assets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatFileSize(assets.reduce((total, asset) => total + asset.size, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {ASSET_TYPES.length}
              </div>
              <div className="text-sm text-gray-600">Asset Types</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
