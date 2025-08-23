import { Image, StyleSheet} from 'react-native'
import Logo from '../assets/img/internship_logo.png' 
import { Link } from 'expo-router'

import ThemedView from "../components/ThemedView"
import ThemedText from "../components/ThemedText"
import Spacer from "../components/Spacer"
import { Colors } from '../constants/Colors'

const Home = () => {
  return (
     <ThemedView style={styles.container}>
      <Image source={Logo} style={styles.img} />

      <ThemedText style={styles.title} title={true}>Hello, you are: </ThemedText>

      <Link href="/student/login" style={styles.link}>
        <ThemedText style={styles.linkText}>Student</ThemedText>
      </Link>

      <Link href="/professor/login" style={styles.link}>
        <ThemedText style={styles.linkText}>Professor</ThemedText>
      </Link>

    
    </ThemedView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e0dfe8ff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    marginVertical: 20,
    width: 150,
    height: 150,
    resizeMode: 'contain'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 28,
    color: '#151e38ff', // Navy blue
  },
  link: {
    marginVertical: 12,
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#161d32ffff',
    shadowColor: '#151e38ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  linkText: {
    color: '#151e38ff', // Navy blue
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  }
})
