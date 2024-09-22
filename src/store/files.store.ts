import { create } from 'zustand';

interface FilesState {
	isUploading: boolean;
	isDownloading: boolean;
	fileUploadingProgress: number;
	fileDownloadingProgress: number;

	setIsUploading: (isUploading: boolean) => void;
	setIsDownloading: (isDownloading: boolean) => void;
	setFileUploadProgress: (fileUploadingProgress: number) => void;
	setFileDownloadProgress: (fileDownloadingProgress: number) => void;
}

const useFilesStore = create<FilesState>()(set => ({
	isUploading: false,
	isDownloading: false,
	fileUploadingProgress: 0,
	fileDownloadingProgress: 0,

	setIsUploading: (isUploading: boolean) => set({ isUploading }),
	setIsDownloading: (isDownloading: boolean) => set({ isDownloading }),
	setFileUploadProgress: (fileUploadingProgress: number) =>
		set({ fileUploadingProgress }),
	setFileDownloadProgress: (fileDownloadingProgress: number) =>
		set({ fileDownloadingProgress })
}));

export default useFilesStore;
