/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    useState,
    useContext,
    useEffect,
    ReactNode,
    createContext,
  } from 'react';
  import {Dimensions as dim, useWindowDimensions} from 'react-native';
  import {isTablet} from 'react-native-device-info';
  
  // Define the shape of context values
  interface ScreenContextType {
    windowHeight: number;
    windowWidth: number;
    isPortrait: boolean;
    windowScale: number;
    windowFontScale: number;
    isTypeTablet: boolean;
  }
  
  // Create the context with a default undefined
  const ScreenContext = createContext<ScreenContextType | undefined>(undefined);
  
  // Custom hook for using the context
  export const useScreenContext = (): ScreenContextType => {
    const context = useContext(ScreenContext);
    if (!context) {
      throw new Error('useScreenContext must be used within a ScreenContextProvider');
    }
    return context;
  };
  
  // Props type for the provider
  interface ScreenContextProviderProps {
    children: ReactNode;
  }
  
  // Provider component
  export const ScreenContextProvider = ({
    children,
  }: ScreenContextProviderProps ) => {
    const dimensions = useWindowDimensions();
  
    const initHeight = dim.get('window').height;
    const initWidth = dim.get('window').width;
    const initScale = dim.get('window').scale;
    const initFontScale = dim.get('window').fontScale;
    const portrait = initHeight > initWidth;
    const isTypeTablet = isTablet();
  
    const [windowHeight, setWindowHeight] = useState<number>(initHeight);
    const [windowWidth, setWindowWidth] = useState<number>(initWidth);
    const [windowScale, setWindowScale] = useState<number>(initScale);
    const [windowFontScale, setWindowFontScale] = useState<number>(initFontScale);
    const [isPortrait, setIsPortrait] = useState<boolean>(portrait);
  
    useEffect(() => {
      setItem();
    }, [dimensions]);
  
    function setItem() {
      const {fontScale, height, scale, width} = dimensions;
      const modPortrait = height > width;
      setWindowHeight(height);
      setWindowWidth(width);
      setWindowScale(scale);
      setWindowFontScale(fontScale);
      setIsPortrait(modPortrait);
    }
  
    return (
      <ScreenContext.Provider
        value={{
          windowHeight,
          windowWidth,
          isPortrait,
          windowScale,
          windowFontScale,
          isTypeTablet,
        }}>
        {children}
      </ScreenContext.Provider>
    );
  };
  