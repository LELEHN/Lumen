
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"

interface HeaderProps {
  showIcons?: boolean
  showSearch?: boolean
}

export default function Header({ showIcons = true, showSearch = true }: HeaderProps) {
    const router = useRouter()

  return (
    <View style={styles.wrapper}>

      {/* LINHA GRADIENTE TOPO */}
      <LinearGradient
        colors={["#FF40A3", "#5BBCAA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topBar}
      />

      <View style={styles.header}>

        {/* MENU + LOGO */}
        <View style={styles.headerLeft}>
          <TouchableOpacity>
            <Image
              source={require("../../assets/images/mais.png")}
              style={styles.iconMenu}
            />
          </TouchableOpacity>
          <Text style={styles.logo}>
            <Text style={styles.logoEudora}>Eudora</Text>
            <Text style={styles.logoSep}> | </Text>
            <Text style={styles.logoBoticario}>Boticário</Text>
          </Text>
        </View>

        {/* ÍCONES DIREITA */}
        {showIcons && (
          <View style={styles.icons}>
            <TouchableOpacity onPress={() => router.push("/login")}>
  <Image source={require("../../assets/images/do-utilizador.png")} style={styles.icon} />
</TouchableOpacity>
            <TouchableOpacity>
              <Image source={require("../../assets/images/coracao.png")} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require("../../assets/images/sacola-de-compras.png")} style={styles.icon} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* BUSCA */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produtos..."
            placeholderTextColor="#aaa"
          />
        </View>
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  topBar: {
    height: 4,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconMenu: {
    width: 22,
    height: 22,
    tintColor: "#333",
  },
  logo: {
    fontSize: 16,
    fontWeight: "700",
  },
  logoEudora: {
    color: "#FF40A3",
    fontSize: 16,
    fontWeight: "700",
  },
  logoSep: {
    color: "#ccc",
    fontSize: 16,
  },
  logoBoticario: {
    color: "#5BBCAA",
    fontSize: 16,
    fontWeight: "700",
  },
  icons: {
    flexDirection: "row",
    gap: 14,
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: "#555",
  },
  searchContainer: {
    paddingHorizontal: 16,
  },
  searchInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
  },
})