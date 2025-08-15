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
                    borderTop: '1px solid #f0f0f0',
                    paddingBottom: 'env(safe-area-inset-bottom)',
                  }}
                >
                  <IonTabButton tab="home" href="/home" style={{ '--color': '#666', '--color-selected': '#ff5a5e' }}>
                    <HomeOutlinedIcon style={{ fontSize: 24 }} />
                    <IonLabel>首页</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="group" href="/group" style={{ '--color': '#666', '--color-selected': '#ff5a5e' }}>
                    <InterestsOutlinedIcon style={{ fontSize: 24 }} />
                    <IonLabel>共识圈子</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="message" href="/message" style={{ '--color': '#666', '--color-selected': '#ff5a5e' }}>
                    <SmsOutlinedIcon style={{ fontSize: 24 }} />
                    <IonLabel>消息</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="mine" href="/mine" style={{ '--color': '#666', '--color-selected': '#ff5a5e' }}>
                    <PersonOutlineOutlinedIcon style={{ fontSize: 24 }} />
                    <IonLabel>我的</IonLabel>
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
