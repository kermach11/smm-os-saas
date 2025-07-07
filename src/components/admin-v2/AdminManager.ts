/**
 * 🎯 ADMIN MANAGER - Централізоване управління адмін панеллю V2
 * 
 * Цей файл управляє всіма аспектами адмін панелі:
 * - Версіями (V1/V2)
 * - Responsive поведінкою
 * - Станом сесії
 * - Конфігурацією
 */

export type AdminPanelVersion = 'v1' | 'v2';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface AdminPanelState {
  isVisible: boolean;
  currentVersion: AdminPanelVersion;
  deviceType: DeviceType;
  activeTab: string;
  isAuthenticated: boolean;
}

interface AdminPanelConfig {
  width: string;
  height: string;
  padding: string;
  fontSize: {
    header: string;
    body: string;
    small: string;
  };
  spacing: {
    tabs: string;
    content: string;
    margins: string;
  };
}

/**
 * 🎯 ADMIN MANAGER CLASS - Singleton для управління адмін панеллю
 */
class AdminManager {
  private state: AdminPanelState;
  private listeners: Array<(state: AdminPanelState) => void> = [];
  private configs: Record<DeviceType, AdminPanelConfig>;

  constructor() {
    // 🎯 ПОЧАТКОВИЙ СТАН - V2 як default!
    this.state = {
      isVisible: false,
      currentVersion: 'v2', // 🚀 ЗМІНЕНО: V2 як основна версія
      deviceType: this.detectDeviceType(),
      activeTab: 'preview',
      isAuthenticated: false
    };

    // 📐 Конфігурації для різних пристроїв
    this.configs = {
      mobile: {
        width: '100%',
        height: '100vh',
        padding: '8px',
        fontSize: {
          header: '16px',
          body: '14px',
          small: '12px'
        },
        spacing: {
          tabs: '4px',
          content: '8px',
          margins: '8px'
        }
      },
      tablet: {
        width: '90%',
        height: '85vh',
        padding: '16px',
        fontSize: {
          header: '18px',
          body: '15px',
          small: '13px'
        },
        spacing: {
          tabs: '6px',
          content: '12px',
          margins: '12px'
        }
      },
      desktop: {
        width: '85%',
        height: '90vh',
        padding: '24px',
        fontSize: {
          header: '20px',
          body: '16px',
          small: '14px'
        },
        spacing: {
          tabs: '8px',
          content: '16px',
          margins: '16px'
        }
      }
    };

    // 🎧 Слухаємо зміни розміру вікна
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize.bind(this));
    }
  }

  /**
   * 📱 Визначення типу пристрою
   */
  private detectDeviceType(): DeviceType {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  /**
   * 🔄 Обробка зміни розміру вікна
   */
  private handleResize() {
    const newDeviceType = this.detectDeviceType();
    if (newDeviceType !== this.state.deviceType) {
      this.setState({ deviceType: newDeviceType });
    }
  }

  /**
   * 🎯 Встановлення нового стану
   */
  private setState(newState: Partial<AdminPanelState>) {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  /**
   * 📡 Сповіщення слухачів про зміни
   */
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * 🎯 Публічні методи
   */
  
  // Отримання поточного стану
  getState(): AdminPanelState {
    return { ...this.state };
  }

  // Підписка на зміни
  subscribe(listener: (state: AdminPanelState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Переключення панелі
  togglePanel(forceState?: boolean) {
    const newState = forceState !== undefined ? forceState : !this.state.isVisible;
    this.setState({ isVisible: newState });
  }

  // Перемикання версій
  switchVersion(version: AdminPanelVersion) {
    this.setState({ currentVersion: version });
    
    // Зберігаємо вибір користувача
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('adminPanelVersion', version);
    }
    
    console.log(`🔄 Admin Panel switched to ${version.toUpperCase()}`);
  }

  // Встановлення активної вкладки
  setActiveTab(tab: string) {
    this.setState({ activeTab: tab });
  }

  // Встановлення статусу авторизації
  setAuthenticated(isAuthenticated: boolean) {
    this.setState({ isAuthenticated });
  }

  // Отримання конфігурації для поточного пристрою
  getDeviceConfig(): AdminPanelConfig {
    return this.configs[this.state.deviceType];
  }

  // Перевірка показу кнопки адміна
  shouldShowAdminButton(): boolean {
    if (typeof window === 'undefined') return false;
    
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('admin') || window.location.port === '8081';
  }

  // Отримання оптимальних розмірів
  getOptimalDimensions() {
    const { deviceType } = this.state;
    return {
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'desktop',
      config: this.configs[deviceType]
    };
  }

  // Ініціалізація з збереженими налаштуваннями
  initialize() {
    if (typeof localStorage !== 'undefined') {
      const savedVersion = localStorage.getItem('adminPanelVersion') as AdminPanelVersion;
      if (savedVersion && (savedVersion === 'v1' || savedVersion === 'v2')) {
        this.setState({ currentVersion: savedVersion });
      }
    }
  }
}

// 🎯 Експорт singleton instance
export const adminManager = new AdminManager();

// Ініціалізація при імпорті
if (typeof window !== 'undefined') {
  adminManager.initialize();
} 