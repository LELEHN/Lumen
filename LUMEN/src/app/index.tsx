// src/app/index.tsx

import { useEffect, useRef, useState } from "react"
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Animated } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import Header from "../components/Header"

const bannerProdutos = [
  {
    image: require("../../assets/images/Perfume_Malbec_Gold_O_Boticario_100ml_4.webp"),
  },
  {
    image: require("../../assets/images/Eudora Eau de Parfum Eudora.jpg"),
  },
  {
    image: require("../../assets/images/Kit Eudora Glam.webp"),
  },
  {
    image: require("../../assets/images/Sérum de Alta potência Vitamina C 10% Botik 15ml.webp"),
  },
]

const categorias = ["Todos", "Eudora", "O Boticário", "Perfumes", "Cuidados"]

const produtos = [
  {
    id: 1,
    nome: "Body Splash Cuide-Se Bem Amoruda",
    marca: "O Boticário",
    preco: "R$ 49,90",
    image: require("../../assets/images/Body Splash Cuide-Se Bem Amoruda 200Ml O Boticário.avif"),
  },
  {
    id: 2,
    nome: "Creme Para Pentear Siàge Pro",
    marca: "Eudora",
    preco: "R$ 89,90",
    image: require("../../assets/images/Creme Para Pentear Siàge Pro Cronology Curvas Volume Eudora 300ml.webp"),
  },
  {
    id: 3,
    nome: "Eau de Parfum Eudora",
    marca: "Eudora",
    preco: "R$ 159,90",
    image: require("../../assets/images/Eudora Eau de Parfum Eudora.jpg"),
  },
  {
    id: 4,
    nome: "Kit Eudora Glam",
    marca: "Eudora",
    preco: "R$ 129,90",
    image: require("../../assets/images/Kit Eudora Glam.webp"),
  },
  {
    id: 5,
    nome: "Malbec Noir Desodorante Colônia",
    marca: "O Boticário",
    preco: "R$ 219,90",
    image: require("../../assets/images/Malbec Noir Desodorante Colônia 100ml.jpg"),
  },
  {
    id: 6,
    nome: "Cuide-se Bem Melancia",
    marca: "O Boticário",
    preco: "R$ 44,90",
    image: require("../../assets/images/O Boticário - Cuide-se Bem Melancia.avif"),
  },
  {
    id: 7,
    nome: "Kit Desodorante Antitranspirante Malbec",
    marca: "O Boticário",
    preco: "R$ 189,90",
    image: require("../../assets/images/O Boticário Kit Desodorante Antitranspirante Malbec.webp"),
  },
  {
    id: 8,
    nome: "Perfume Egeo Dolce Colônia",
    marca: "O Boticário",
    preco: "R$ 179,90",
    image: require("../../assets/images/Perfume Egeo Dolce Colônia, 90ml O Boticário.webp"),
  },
  {
    id: 9,
    nome: "Perfume Malbec Gold",
    marca: "O Boticário",
    preco: "R$ 259,90",
    image: require("../../assets/images/Perfume_Malbec_Gold_O_Boticario_100ml_4.webp"),
  },
  {
    id: 10,
    nome: "Sérum Vitamina C 10% Botik",
    marca: "O Boticário",
    preco: "R$ 99,90",
    image: require("../../assets/images/Sérum de Alta potência Vitamina C 10% Botik 15ml.webp"),
  },
  {
    id: 11,
    nome: "Siàge Kit Completo",
    marca: "Eudora",
    preco: "R$ 199,90",
    image: require("../../assets/images/Siàge Eudora Kit Completo Acelera o Crescimento 5 produtos.webp"),
  },
]

export default function Home() {
  const router = useRouter()
  const [bannerIndex, setBannerIndex] = useState(0)
  const fadeAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setBannerIndex((prev) => (prev + 1) % bannerProdutos.length)
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start()
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* CATEGORIAS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categorias.map((cat, index) => (
            index === 0 ? (
              <LinearGradient
                key={cat}
                colors={["#FF40A3", "#5BBCAA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.categoryBtnActive}
              >
                <Text style={styles.categoryTextActive}>{cat}</Text>
              </LinearGradient>
            ) : (
              <TouchableOpacity key={cat} style={styles.categoryBtn}>
                <Text style={styles.categoryText}>{cat}</Text>
              </TouchableOpacity>
            )
          ))}
        </ScrollView>

        {/* BANNER */}
        <View style={styles.banner}>
          <View style={styles.bannerTextArea}>
            <Text style={styles.bannerTitle}>Produtos{"\n"}da Loja</Text>
            <TouchableOpacity>
              <LinearGradient
                colors={["#FF40A3", "#5BBCAA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.bannerBtn}
              >
                <Text style={styles.bannerBtnText}>Comprar agora</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Animated.View style={[styles.bannerImageBox, { opacity: fadeAnim }]}>
            <Image
              source={bannerProdutos[bannerIndex].image}
              style={styles.bannerImage}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* INDICADORES */}
        <View style={styles.dotsContainer}>
          {bannerProdutos.map((_, index) => (
            index === bannerIndex ? (
              <LinearGradient
                key={index}
                colors={["#FF40A3", "#5BBCAA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.dotActive}
              />
            ) : (
              <View key={index} style={styles.dot} />
            )
          ))}
        </View>

        {/* TÍTULO SEÇÃO */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mais Vendidos</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {/* GRID DE PRODUTOS */}
        <View style={styles.grid}>
          {produtos.map((produto) => (
            <TouchableOpacity
              key={produto.id}
              style={styles.card}
             onPress={() => router.push(`/produto/${produto.id}` as any)}
            >
              <Image
                source={produto.image}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <Text style={styles.cardNome} numberOfLines={2}>{produto.nome}</Text>
              <Text style={styles.cardMarca}>{produto.marca}</Text>
              <Text style={styles.cardPreco}>{produto.preco}</Text>
              <LinearGradient
                colors={["#FF40A3", "#5BBCAA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cardBtn}
              >
                <Text style={styles.cardBtnText}>Adicionar</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // CATEGORIAS
  categoriesScroll: {
    paddingLeft: 16,
    paddingVertical: 16,
  },
  categoryBtnActive: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  categoryTextActive: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  categoryBtn: {
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  categoryText: {
    color: "#999",
    fontSize: 13,
    fontWeight: "600",
  },

  // BANNER
  banner: {
    marginHorizontal: 16,
    backgroundColor: "#FCE4EC",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bannerTextArea: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FF40A3",
    marginBottom: 12,
  },
  bannerBtn: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  bannerBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  bannerImageBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    marginLeft: 12,
  },
  bannerImage: {
    width: 100,
    height: 100,
  },

  // INDICADORES
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    marginBottom: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ddd",
  },
  dotActive: {
    width: 18,
    height: 6,
    borderRadius: 3,
  },

  // SEÇÃO
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  seeAll: {
    fontSize: 13,
    color: "#FF40A3",
    fontWeight: "600",
  },

  // GRID
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 12,
    paddingBottom: 32,
  },
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 130,
    marginBottom: 8,
    borderRadius: 8,
  },
  cardNome: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    minHeight: 32,
  },
  cardMarca: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  cardPreco: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF40A3",
    marginTop: 4,
    marginBottom: 2,
  },
  cardBtn: {
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 8,
  },
  cardBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
})