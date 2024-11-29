import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'; // För att hantera teman (mörkt/ljust)
import { useFonts } from 'expo-font'; // För att ladda och använda anpassade typsnitt
import { Stack } from 'expo-router'; // Stack-navigering från Expo Router
import * as SplashScreen from 'expo-splash-screen'; // Hanterar splash screen (startskärm)
import { useEffect } from 'react'; // React Hook för att hantera sid-effekter
import 'react-native-reanimated'; // Bibliotek för smidig animation
import { useColorScheme } from '@/hooks/useColorScheme'; // Anpassad hook för att hämta användarens färgschema

// Hindrar splash-skärmen från att stängas automatiskt innan appen är klar att visas
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme(); // Hämta användarens färgschema (mörkt eller ljust)
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'), // Laddar ett anpassat typsnitt
  });

  // När typsnittet är laddat, stäng splash-skärmen
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync(); // Döljer splash-skärmen
    }
  }, [loaded]);

  // Visa inget om typsnittet inte är laddat ännu
  if (!loaded) {
    return null; // Returnerar ingenting om resurserna fortfarande laddas
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Definierar temat för applikationen baserat på användarens färgschema */}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Flik-navigeringen visas utan rubrik. */}

        <Stack.Screen name="+not-found" />
        {/* En extra skärm som kan visas för sidor som inte hittas (404). */}
      </Stack>
    </ThemeProvider>
  );
}

