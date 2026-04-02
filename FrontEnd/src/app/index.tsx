// src/app/index.tsx

import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Header from "../components/Header";
import { listarProdutos } from "./services/produtoService";

type Produto = {
  id: number;
  nome: string;
  marca: string;
  preco: number;
  imagem: string;
};

export default function Home() {
  const router = useRouter();
  const [bannerIndex, setBannerIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // 🔥 CARREGAR PRODUTOS
  useEffect(() => {
    async function carregarProdutos() {
      try {
        const dados = await listarProdutos();
        setProdutos(dados);
      } catch (err) {
        console.log(err);
      }
    }

    carregarProdutos();
  }, []);

  // 🔥 BANNER DINÂMICO
  useEffect(() => {
    if (produtos.length === 0) return;

    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setBannerIndex((prev) => (prev + 1) % produtos.length);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [produtos]);

  // 🔥 CATEGORIAS DINÂMICAS (baseado na marca)
  const categorias = [...new Set(produtos.map((p) => p.marca))];

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* CATEGORIAS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          {categorias.map((cat, index) =>
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
          )}
        </ScrollView>

        {/* BANNER */}
        <View style={styles.banner}>
          <View style={styles.bannerTextArea}>
            <Text style={styles.bannerTitle}>
              Produtos{"\n"}da Loja
            </Text>
          </View>

          <Animated.View
            style={[styles.bannerImageBox, { opacity: fadeAnim }]}
          >
            {produtos.length > 0 && (
              <Image
                source={{
                  uri: `http://192.168.0.183:5010/storage/imagemProduto/${produtos[bannerIndex]?.imagem}`,
                }}
                style={styles.bannerImage}
                resizeMode="contain"
              />
            )}
          </Animated.View>
        </View>

        {/* INDICADORES */}
        <View style={styles.dotsContainer}>
          {produtos.map((_, index) =>
            index === bannerIndex ? (
              <LinearGradient
                key={index}
                colors={["#FF40A3", "#5BBCAA"]}
                style={styles.dotActive}
              />
            ) : (
              <View key={index} style={styles.dot} />
            )
          )}
        </View>

        {/* TÍTULO */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Produtos</Text>
        </View>

        {/* GRID */}
        <View style={styles.grid}>
          {produtos.map((produto) => (
            <TouchableOpacity
              key={produto.id}
              style={styles.card}
              onPress={() =>
                router.push(`/produto/${produto.id}` as any)
              }
            >
              <Image
                source={{
                  uri: `http://192.168.0.183:5010/storage/imagemProduto/${produto.imagem}`,
                }}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <Text style={styles.cardNome}>{produto.nome}</Text>
              <Text style={styles.cardMarca}>{produto.marca}</Text>
              <Text style={styles.cardPreco}>
                R$ {produto.preco}
              </Text>

              <LinearGradient
                colors={["#FF40A3", "#5BBCAA"]}
                style={styles.cardBtn}
              >
                <Text style={styles.cardBtnText}>Adicionar</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
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