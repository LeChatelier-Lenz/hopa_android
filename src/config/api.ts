// API配置 - 基于主机地址环境变量

interface APIConfig {
  backendUrl: string;
  doubaoProxyUrl: string;
}

class APIConfiguration {
  private config: APIConfig;

  constructor() {
    this.config = this.buildConfig();
  }

  private buildConfig(): APIConfig {
    // 获取主机地址环境变量
    const hostIP = import.meta.env.VITE_HOST_IP || '10.162.149.24';
    
    // 检测是否在移动设备环境
    const isCapacitor = !!(window as any).Capacitor;
    const isCordova = !!(window as any).cordova;
    const isIonic = window.location.protocol === 'ionic:';
    const isAndroidEmulator = window.location.hostname === '10.162.149.24' || 
                             window.location.hostname.includes('10.') ||
                             window.location.hostname.includes('192.168.');
    const isMobile = isCapacitor || isCordova || isIonic || isAndroidEmulator;
    
    console.log('🔍 API配置:', {
      hostIP,
      isCapacitor,
      isCordova,
      isIonic,
      isAndroidEmulator,
      isMobile,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      userAgent: navigator.userAgent
    });

    if (isMobile) {
      // 移动设备环境 - 使用配置的主机IP + 后端端口3001
      const backendBaseUrl = `http://${hostIP}:3001`;
      console.log('📱 移动设备环境，后端地址:', backendBaseUrl);
      return {
        backendUrl: `${backendBaseUrl}/ai`,
        doubaoProxyUrl: `${backendBaseUrl}/ai/proxy/image`
      };
    } else {
      // 浏览器环境 - 使用localhost
      console.log('🌐 浏览器环境，使用localhost');
      return {
        backendUrl: 'http://localhost:3001/ai',
        doubaoProxyUrl: 'http://localhost:3001/ai/proxy/image'
      };
    }
  }

  // 获取当前API配置
  getConfig(): APIConfig {
    return this.config;
  }

  // 获取后端API URL
  getBackendUrl(): string {
    return this.config.backendUrl;
  }

  // 获取图片代理URL
  getImageProxyUrl(): string {
    return this.config.doubaoProxyUrl;
  }

  // 构建图片代理完整URL
  buildImageProxyUrl(imageUrl: string): string {
    return `${this.config.doubaoProxyUrl}?url=${encodeURIComponent(imageUrl)}`;
  }
}

// 导出单例实例
export const apiConfig = new APIConfiguration();
export default apiConfig;