
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { useCarrinho } from "../../context/CarrinhoContext"

const todosProdutos = [
  {
    id: 1,
    nome: "Body Splash Cuide-Se Bem Amoruda",
    marca: "O Boticário",
    preco: "R$ 49,90",
    categorias: "Cuidados",
    concentracao: "-",
    familiaOlfativa: "-",
    subfamilias: "-",
    ocasiao: "Dia",
    propriedades: "Cruelty Free",
    linha: "Cuide-Se Bem",
    detalhes: "Body Splash Cuide-Se Bem Amoruda 200ml.\n\nUma fragrância doce e envolvente para o dia a dia.",
    image: require("../../../assets/images/Body Splash Cuide-Se Bem Amoruda 200Ml O Boticário.avif"),
  },
  {
    id: 2,
    nome: "Creme Para Pentear Siàge Pro",
    marca: "Eudora",
    preco: "R$ 89,90",
    categorias: "Cabelos",
    concentracao: "-",
    familiaOlfativa: "-",
    subfamilias: "-",
    ocasiao: "Dia a dia",
    propriedades: "Vegano",
    linha: "Siàge",
    detalhes: "Creme Para Pentear Siàge Pro Cronology Curvas Volume 300ml.\n\nFormulado para definir e hidratar cachos e ondas.",
    image: require("../../../assets/images/Creme Para Pentear Siàge Pro Cronology Curvas Volume Eudora 300ml.webp"),
  },
  {
    id: 3,
    nome: "Eau de Parfum Eudora",
    marca: "Eudora",
    preco: "R$ 159,90",
    categorias: "Perfume feminino",
    concentracao: "Eau de Parfum",
    familiaOlfativa: "Floral",
    subfamilias: "Frutal",
    ocasiao: "Dia e Noite",
    propriedades: "Cruelty Free",
    linha: "Eudora",
    detalhes: "Eau de Parfum Eudora.\n\nUma fragrância feminina sofisticada com notas florais e frutadas.",
    image: require("../../../assets/images/Eudora Eau de Parfum Eudora.jpg"),
  },
  {
    id: 4,
    nome: "Kit Eudora Glam",
    marca: "Eudora",
    preco: "R$ 129,90",
    categorias: "Maquiagem",
    concentracao: "-",
    familiaOlfativa: "-",
    subfamilias: "-",
    ocasiao: "Noite",
    propriedades: "Cruelty Free",
    linha: "Glam",
    detalhes: "Kit Eudora Glam completo.\n\nKit com produtos de maquiagem para looks incríveis.",
    image: require("../../../assets/images/Kit Eudora Glam.webp"),
  },
  {
    id: 5,
    nome: "Malbec Noir Desodorante Colônia",
    marca: "O Boticário",
    preco: "R$ 219,90",
    categorias: "Perfume masculino",
    concentracao: "Desodorante Colônia",
    familiaOlfativa: "Amadeirado",
    subfamilias: "Especiado",
    ocasiao: "Noite",
    propriedades: "Longa duração",
    linha: "Malbec",
    detalhes: "Malbec Noir Desodorante Colônia 100ml.\n\nA versão mais intensa e sedutora do icônico Malbec.",
    image: require("../../../assets/images/Malbec Noir Desodorante Colônia 100ml.jpg"),
  },
  {
    id: 6,
    nome: "Cuide-se Bem Melancia",
    marca: "O Boticário",
    preco: "R$ 44,90",
    categorias: "Cuidados",
    concentracao: "-",
    familiaOlfativa: "Frutal",
    subfamilias: "Aquoso",
    ocasiao: "Dia",
    propriedades: "Hidratante",
    linha: "Cuide-Se Bem",
    detalhes: "Cuide-se Bem Melancia O Boticário.\n\nPerfume e hidratação com o frescor da melancia.",
    image: require("../../../assets/images/O Boticário - Cuide-se Bem Melancia.avif"),
  },
  {
    id: 7,
    nome: "Kit Desodorante Antitranspirante Malbec",
    marca: "O Boticário",
    preco: "R$ 189,90",
    categorias: "Desodorante",
    concentracao: "Antitranspirante",
    familiaOlfativa: "Amadeirado",
    subfamilias: "Especiado",
    ocasiao: "Dia a dia",
    propriedades: "48h proteção",
    linha: "Malbec",
    detalhes: "Kit Desodorante Antitranspirante Malbec.\n\nProteção e sofisticação para o dia a dia.",
    image: require("../../../assets/images/O Boticário Kit Desodorante Antitranspirante Malbec.webp"),
  },
  {
    id: 8,
    nome: "Perfume Egeo Dolce Colônia",
    marca: "O Boticário",
    preco: "R$ 179,90",
    categorias: "Perfume feminino",
    concentracao: "Colônia",
    familiaOlfativa: "Floral",
    subfamilias: "Doce",
    ocasiao: "Dia",
    propriedades: "Cruelty Free",
    linha: "Egeo",
    detalhes: "Perfume Egeo Dolce Colônia 90ml O Boticário.\n\nUma fragrância doce e delicada com toque floral.",
    image: require("../../../assets/images/Perfume Egeo Dolce Colônia, 90ml O Boticário.webp"),
  },
  {
    id: 9,
    nome: "Perfume Malbec Gold",
    marca: "O Boticário",
    preco: "R$ 259,90",
    categorias: "Perfume masculino",
    concentracao: "Desodorante Colônia",
    familiaOlfativa: "Amadeirado",
    subfamilias: "Especiado",
    ocasiao: "Noite",
    propriedades: "Longa duração",
    linha: "Malbec",
    detalhes: "Perfume Malbec Gold O Boticário 100ml.\n\nA versão mais luxuosa e sofisticada do Malbec.",
    image: require("../../../assets/images/Perfume_Malbec_Gold_O_Boticario_100ml_4.webp"),
  },
  {
    id: 10,
    nome: "Sérum Vitamina C 10% Botik",
    marca: "O Boticário",
    preco: "R$ 99,90",
    categorias: "Skincare",
    concentracao: "-",
    familiaOlfativa: "-",
    subfamilias: "-",
    ocasiao: "Dia",
    propriedades: "Antioxidante",
    linha: "Botik",
    detalhes: "Sérum de Alta Potência Vitamina C 10% Botik 15ml.\n\nFormulado para iluminar e uniformizar o tom da pele.",
    image: require("../../../assets/images/Sérum de Alta potência Vitamina C 10% Botik 15ml.webp"),
  },
  {
    id: 11,
    nome: "Siàge Kit Completo",
    marca: "Eudora",
    preco: "R$ 199,90",
    categorias: "Cabelos",
    concentracao: "-",
    familiaOlfativa: "-",
    subfamilias: "-",
    ocasiao: "Dia a dia",
    propriedades: "Vegano",
    linha: "Siàge",
    detalhes: "Siàge Eudora Kit Completo Acelera o Crescimento 5 produtos.\n\nKit completo para acelerar o crescimento dos cabelos.",
    image: require("../../../assets/images/Siàge Eudora Kit Completo Acelera o Crescimento 5 produtos.webp"),
  },
]

export default function DetalhesProduto() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const [quantidade, setQuantidade] = useState(1)
  const { adicionarItem } = useCarrinho()

  const produto = todosProdutos.find((p) => p.id === Number(id))

  if (!produto) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Produto não encontrado.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.notFoundLink}>Voltar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <LinearGradient
        colors={["#FF40A3", "#5BBCAA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.headerBack}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Produto</Text>
        <TouchableOpacity>
          <Image
            source={require("../../../assets/images/coracao.png")}
            style={styles.headerHeart}
          />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>

        {/* IMAGEM */}
        <View style={styles.imagemContainer}>
          <Image
            source={produto.image}
            style={styles.imagemPrincipal}
            resizeMode="contain"
          />
        </View>

        {/* CARD INFO */}
        <View style={styles.card}>

          {/* NOME E PREÇO */}
          <View style={styles.nomePreco}>
            <Text style={styles.nome}>{produto.nome}</Text>
            <Text style={styles.preco}>{produto.preco}</Text>
          </View>

          <View style={styles.divider} />

          {/* GRID DE ATRIBUTOS */}
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Categorias</Text>
              <Text style={styles.gridValue}>{produto.categorias}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Concentração</Text>
              <Text style={styles.gridValue}>{produto.concentracao}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Família Olfativa</Text>
              <Text style={styles.gridValue}>{produto.familiaOlfativa}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Subfamílias</Text>
              <Text style={styles.gridValue}>{produto.subfamilias}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Ocasião</Text>
              <Text style={styles.gridValue}>{produto.ocasiao}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Propriedades</Text>
              <Text style={styles.gridValue}>{produto.propriedades}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Marca</Text>
              <Text style={styles.gridValue}>{produto.marca}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Linha</Text>
              <Text style={styles.gridValue}>{produto.linha}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* DETALHES */}
          <Text style={styles.detalhesTitle}>Detalhes</Text>
          <Text style={styles.detalhesText}>{produto.detalhes}</Text>

        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* FOOTER FIXO */}
      <View style={styles.footer}>
        <View style={styles.quantidade}>
          <TouchableOpacity
            onPress={() => setQuantidade((q) => Math.max(1, q - 1))}
            style={styles.quantBtn}
          >
            <Text style={styles.quantBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantNum}>{quantidade}</Text>
          <TouchableOpacity
            onPress={() => setQuantidade((q) => q + 1)}
            style={styles.quantBtn}
          >
            <Text style={styles.quantBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
  style={styles.btnSacola}
  onPress={() => {
    adicionarItem({
      id: produto.id,
      nome: produto.nome,
      marca: produto.marca,
      preco: produto.preco,
      image: produto.image,
    })
    router.push("/carrinho" as any)
  }}
>
  <LinearGradient
    colors={["#FF40A3", "#5BBCAA"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.btnSacolaGradient}
  >
    <Image
      source={require("../../../assets/images/sacola-de-compras.png")}
      style={styles.btnSacolaIcone}
    />
    <Text style={styles.btnSacolaText}>Adicionar à Sacola</Text>
  </LinearGradient>
</TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  notFoundText: {
    fontSize: 16,
    color: "#666",
  },
  notFoundLink: {
    fontSize: 14,
    color: "#FF40A3",
    fontWeight: "700",
  },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
  },
  headerBack: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  headerHeart: {
    width: 22,
    height: 22,
    tintColor: "#fff",
  },

  // IMAGEM
  imagemContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  imagemPrincipal: {
    width: "100%",
    height: "100%",
  },

  // SCROLL
  scroll: {
    flex: 1,
  },

  // CARD
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: -20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  nomePreco: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 8,
  },
  nome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  preco: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FF40A3",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 16,
  },

  // GRID ATRIBUTOS
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    width: "50%",
    marginBottom: 16,
  },
  gridLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  gridValue: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },

  // DETALHES
  detalhesTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF40A3",
    marginBottom: 8,
  },
  detalhesText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  },

  // FOOTER
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 28,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 16,
  },
  quantidade: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quantBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  quantBtnText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  quantNum: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  btnSacola: {
    flex: 1,
  },
  btnSacolaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    paddingVertical: 14,
    gap: 8,
  },
  btnSacolaIcone: {
    width: 20,
    height: 20,
    tintColor: "#fff",
  },
  btnSacolaText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
})