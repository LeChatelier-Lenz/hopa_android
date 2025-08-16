import React, { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Home from './pages/home';
import Group from './pages/group';
import Message from './pages/message';
import Mine from './pages/mine';
import PreferenceSettings from './pages/preferences';
import PreferencesComplete from './pages/preferences-complete';
import LaunchPage from './pages/launch';
import GamePage from './pages/game';
import ErrorPage from './pages/ErrorPage';
import { theme } from './theme/theme';
import { PreferencesProvider } from './context/PreferencesContext';
import SplashScreen from './components/SplashScreen';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InterestsOutlinedIcon from '@mui/icons-material/InterestsOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

// 导入自定义图标
import homeIcon from './assets/images/home_icon.png';
import groupIcon from './assets/images/group_icon.png';
import messageIcon from './assets/images/message_icon.png';
import mineIcon from './assets/images/mypage_icon.png';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import './fonts/fonts.css';
import './theme/globalStyles.css';

setupIonicReact();

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <PreferencesProvider>
      <IonApp>
        <IonReactRouter>
          <Switch>
            {/* 偏好设置页面 - 不显示底部导航栏 */}
            <Route exact path="/preferences">
              <PreferenceSettings />
            </Route>
            <Route exact path="/preferences-complete">
              <PreferencesComplete />
            </Route>
            
            {/* 发起共识页面 - 不显示底部导航栏 */}
            <Route exact path="/launch">
              <LaunchPage />
            </Route>
            
            {/* 游戏页面 - 不显示底部导航栏 */}
            <Route exact path="/game">
              <GamePage />
            </Route>
            
            {/* 错误页面 - 不显示底部导航栏 */}
            <Route exact path="/error">
              <ErrorPage />
            </Route>
            
            {/* 主应用路由 - 带底部导航栏 */}
            <Route>
              <IonTabs>
                <IonRouterOutlet>
                  <Route exact path="/home">
                    <Home />
                  </Route>
                  <Route exact path="/group">
                    <Group />
                  </Route>
                  <Route path="/message">
                    <Message />
                  </Route>
                  <Route path="/mine">
                    <Mine />
                  </Route>
                  <Route exact path="/">
                    <Redirect to="/home" />
                  </Route>
                </IonRouterOutlet>
                <IonTabBar 
                  slot="bottom" 
                  style={{
                    '--ion-color-primary': '#ff5a5e',
                    '--ion-color-primary-rgb': '255, 90, 94',
                    '--ion-color-primary-contrast': '#ffffff',
                    '--ion-color-primary-contrast-rgb': '255, 255, 255',
                    '--ion-color-primary-shade': '#e64549',
                    '--ion-color-primary-tint': '#ff7a7e',
                    background: 'linear-gradient(135deg,#ffffff 0%, #fefefe 100%)',
                    borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.08)',
                    height: '80px',
                    paddingTop: '8px',
                    paddingBottom: 'calc(8px + env(safe-area-inset-bottom))',
                  }}
                >
                  <IonTabButton tab="home" href="/home" style={{ 
                    '--color': '#8e8e93', 
                    '--color-selected': '#ff5a5e',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    background: 'transparent',
                    //背景透明，呈现导航栏底色
                  }}>
                    <img src={homeIcon} alt="首页" style={{ width: '60%', height: '60%', marginLeft: '4px',marginRight: '4px', 
                      
                    }} />
                    <IonLabel style={{ fontSize: '14px', fontWeight: 500 }}>首页</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="group" href="/group" style={{ 
                    '--color': '#8e8e93', 
                    '--color-selected': '#ff5a5e',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    background: 'transparent',
                  }}>
                    <img src={groupIcon} alt="共识圈子" style={{ width: '60%', height: '60%', marginLeft: '4px',marginRight: '4px' }} />
                    <IonLabel style={{ fontSize: '14px', fontWeight: 500 }}>共识圈子</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="message" href="/message" style={{ 
                    '--color': '#8e8e93', 
                    '--color-selected': '#ff5a5e',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    background: 'transparent',
                  }}>
                    <img src={messageIcon} alt="消息" style={{ width: '60%', height: '60%', marginLeft: '4px',marginRight: '4px' }} />
                    <IonLabel style={{ fontSize: '14px', fontWeight: 500 }}>消息</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="mine" href="/mine" style={{ 
                    '--color': '#8e8e93', 
                    '--color-selected': '#ff5a5e',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    background: 'transparent',
                  }}>
                    <img src={mineIcon} alt="我的" style={{ width: '60%', height: '60%',marginLeft: '4px',marginRight: '4px' }} />
                    <IonLabel style={{ fontSize: '14px', fontWeight: 500 }}>我的</IonLabel>
                  </IonTabButton>
                </IonTabBar>
              </IonTabs>
            </Route>
          </Switch>
        </IonReactRouter>
      </IonApp>
    </PreferencesProvider>
  </ThemeProvider>
  );
};

export default App;
