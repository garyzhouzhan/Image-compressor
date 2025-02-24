/**
 * 图片压缩工具主要JavaScript逻辑
 */

// 获取DOM元素
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const previewContainer = document.getElementById('previewContainer');
const originalImage = document.getElementById('originalImage');
const compressedImage = document.getElementById('compressedImage');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

// 当前处理的图片文件
let currentFile = null;

// 批量处理相关变量
let batchFiles = [];
const MAX_FILES = 100;

// 绑定上传区域点击事件
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// 处理文件拖放
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#007AFF';
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#DEDEDE';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#DEDEDE';
    handleFile(e.dataTransfer.files);
});

// 处理文件选择
fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files);
});

// 处理图片文件
function handleFile(files) {
    const fileArray = Array.from(files);
    
    if (batchFiles.length + fileArray.length > MAX_FILES) {
        alert(`最多只能同时处理${MAX_FILES}张图片！`);
        return;
    }

    fileArray.forEach(file => {
        if (!file.type.match('image.*')) {
            alert('请选择图片文件！');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = {
                file: file,
                originalSize: file.size,
                originalUrl: e.target.result,
                compressedUrl: null,
                compressedSize: 0
            };
            
            batchFiles.push(imageData);
            updateBatchPreview();
            compressBatchImage(batchFiles.length - 1);
        };
        reader.readAsDataURL(file);
    });
}

// 压缩图片
function compressImage(dataUrl, quality) {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        compressedImage.src = compressedDataUrl;
        
        // 计算压缩后的大小
        const compressedSize = Math.round((compressedDataUrl.length - 22) * 3 / 4);
        document.getElementById('compressedSize').textContent = formatFileSize(compressedSize);
    };
    img.src = dataUrl;
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 处理质量滑块变化
qualitySlider.addEventListener('input', (e) => {
    const quality = e.target.value;
    qualityValue.textContent = quality + '%';
    if (currentFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            compressImage(e.target.result, quality / 100);
        };
        reader.readAsDataURL(currentFile);
    }
});

// 处理下载按钮点击
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'compressed-image.jpg';
    link.href = compressedImage.src;
    link.click();
});

// 更新批量预览
function updateBatchPreview() {
    const batchPreview = document.getElementById('batchPreview');
    const batchList = document.getElementById('batchList');
    const processCount = document.getElementById('processCount');
    
    batchPreview.style.display = 'block';
    processCount.textContent = batchFiles.length;
    
    batchList.innerHTML = batchFiles.map((item, index) => `
        <div class="batch-item">
            <img src="${item.compressedUrl || item.originalUrl}" alt="图片预览">
            <button class="remove-btn" onclick="removeImage(${index})">×</button>
            <div class="file-info">
                <div>原始大小：${formatFileSize(item.originalSize)}</div>
                <div>压缩大小：${item.compressedSize ? formatFileSize(item.compressedSize) : '处理中...'}</div>
            </div>
            <div class="progress-bar">
                <div class="progress" style="width: ${item.compressedUrl ? '100%' : '0%'}"></div>
            </div>
        </div>
    `).join('');
}

// 压缩批量图片
function compressBatchImage(index) {
    const imageData = batchFiles[index];
    const img = new Image();
    
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const quality = document.getElementById('batchQualitySlider').value / 100;
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        imageData.compressedUrl = compressedDataUrl;
        imageData.compressedSize = Math.round((compressedDataUrl.length - 22) * 3 / 4);
        
        updateBatchPreview();
    };
    
    img.src = imageData.originalUrl;
}

// 移除图片
function removeImage(index) {
    batchFiles.splice(index, 1);
    updateBatchPreview();
    if (batchFiles.length === 0) {
        document.getElementById('batchPreview').style.display = 'none';
    }
}

// 批量下载
document.getElementById('batchDownloadBtn').addEventListener('click', () => {
    if (batchFiles.length === 0) {
        alert('请先添加图片！');
        return;
    }

    // 创建ZIP文件
    const zip = new JSZip();
    
    batchFiles.forEach((item, index) => {
        const fileName = `compressed-image-${index + 1}.jpg`;
        // 将base64图片数据添加到zip
        zip.file(fileName, item.compressedUrl.split(',')[1], {base64: true});
    });
    
    // 生成并下载zip文件
    zip.generateAsync({type: 'blob'}).then(content => {
        const link = document.createElement('a');
        link.download = 'compressed-images.zip';
        link.href = URL.createObjectURL(content);
        link.click();
    });
});

// 批量压缩质量控制
document.getElementById('batchQualitySlider').addEventListener('input', (e) => {
    const quality = e.target.value;
    document.getElementById('batchQualityValue').textContent = quality + '%';
    
    // 重新压缩所有图片
    batchFiles.forEach((_, index) => {
        compressBatchImage(index);
    });
}); 