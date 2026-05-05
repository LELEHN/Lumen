// src/app/perfil.tsx

import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useState } from "react"

const cliente = {
  nome: "Lethicia Nobre",
  email: "leleh@email.com",
  telefone: "(11) 95838-9257",
  endereco: "Rua das Flores, 123 - Centro, São Paulo - SP",
  membro: "Cliente desde Janeiro 2024",
}

const pedidos = [
  {
    id: "PED-001",
    data: "20/03/2026",
    valor: "R$ 289,80",
    status: "entregue",
    produtos: [
      { nome: "1x Perfume Floratta Blue", preco: "R$ 129,90" },
      { nome: "2x Nativa SPA Quinoa", preco: "R$ 159,90" },
    ],
    rastreamento: [
      { etapa: "Pedido confirmado", data: "20/03/2026 10:30", feito: true },
      { etapa: "Separando produtos", data: "20/03/2026 14:00", feito: true },
      { etapa: "Enviado", data: "21/03/2026 09:00", feito: true },
      { etapa: "Em trânsito", data: "22/03/2026 11:30", feito: true },
      { etapa: "Entregue", data: "23/03/2026 15:45", feito: true },
    ],
  },
  {
    id: "PED-002",
    data: "23/03/2026",
    valor: "R$ 159,90",
    status: "em_transito",
    produtos: [
      { nome: "1x Malbec Absolu", preco: "R$ 159,90" },
    ],
    rastreamento: [
      { etapa: "Pedido confirmado", data: "23/03/2026 09:00", feito: true },
      { etapa: "Separando produtos", data: "23/03/2026 13:00", feito: true },
      { etapa: "Enviado", data: "24/03/2026 08:00", feito: true },
      { etapa: "Em trânsito", data: "Previsto: 25/03/2026", feito: false },
      { etapa: "Entregue", data: "", feito: false },
    ],
  },
]

const getStatusStyle = (status: string) => {
  if (status === "entregue") return styles.badgeGreen
  if (status === "em_transito") return styles.badgeBlue
  return styles.badgeYellow
}

const getStatusText = (status: string) => {
  if (status === "entregue") return "Entregue"
  if (status === "em_transito") return "Em trânsito"
  return "Pendente"
}

const getStatusTextStyle = (status: string) => {
  if (status === "entregue") return styles.badgeTextGreen
  if (status === "em_transito") return styles.badgeTextBlue
  return styles.badgeTextYellow
}

export default function Perfil() {
  const router = useRouter()
  const [abaAtiva, setAbaAtiva] = useState<"info" | "pedidos">("info")

  return (
    <View style={styles.container}>

      {/* HEADER GRADIENTE */}
      <LinearGradient
        colors={["#FF40A3", "#5BBCAA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.brandName}>Lúmen</Text>
            <Text style={styles.brandSub}>O Boticário & Eudora</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => router.push("/login" as any)}
          >
            <Text style={styles.logoutText}>Sair →</Text>
          </TouchableOpacity>
        </View>

        {/* CARD DO PERFIL */}
        <View style={styles.profileCard}>
          <Text style={styles.profileLabel}>Meu Perfil</Text>
          <Text style={styles.profileSince}>{cliente.membro}</Text>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Image
                source={require("../../assets/images/do-utilizador.png")}
                style={styles.avatarIcon}
              />
            </View>
            <View>
              <Text style={styles.profileName}>{cliente.nome}</Text>
              <Text style={styles.profileEmail}>{cliente.email}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* ABAS */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === "info" && styles.tabActive]}
          onPress={() => setAbaAtiva("info")}
        >
          <Text style={[styles.tabText, abaAtiva === "info" && styles.tabTextActive]}>
            Minhas Informações
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === "pedidos" && styles.tabActive]}
          onPress={() => setAbaAtiva("pedidos")}
        >
          <Text style={[styles.tabText, abaAtiva === "pedidos" && styles.tabTextActive]}>
            Meus Pedidos
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>

        {/* ABA INFORMAÇÕES */}
        {abaAtiva === "info" && (
          <View style={styles.content}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Informações Pessoais</Text>
              <TouchableOpacity>
                <Image
                  source={require("../../assets/images/ferramenta-lapis.png")}
                  style={styles.editIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.infoCard}>

              {/* NOME */}
              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <Image
                    source={require("../../assets/images/do-utilizador.png")}
                    style={styles.infoIconImg}
                  />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Nome Completo</Text>
                  <Text style={styles.infoValue}>{cliente.nome}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* EMAIL */}
              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <Image
                    source={require("../../assets/images/mais.png")}
                    style={styles.infoIconImg}
                  />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{cliente.email}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* TELEFONE */}
              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <Image
                    source={require("../../assets/images/mais.png")}
                    style={styles.infoIconImg}
                  />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Telefone</Text>
                  <Text style={styles.infoValue}>{cliente.telefone}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* ENDEREÇO */}
              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <Image
                    source={require("../../assets/images/caminhao-de-entrega.png")}
                    style={styles.infoIconImg}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Endereço de Entrega</Text>
                  <Text style={styles.infoValue}>{cliente.endereco}</Text>
                </View>
              </View>

            </View>
          </View>
        )}

        {/* ABA PEDIDOS */}
        {abaAtiva === "pedidos" && (
          <View style={styles.content}>
            {pedidos.map((pedido) => (
              <View key={pedido.id} style={styles.pedidoCard}>

                {/* HEADER DO PEDIDO */}
                <View style={styles.pedidoHeader}>
                  <View>
                    <Text style={styles.pedidoId}>Pedido {pedido.id}</Text>
                    <Text style={styles.pedidoData}>{pedido.data}</Text>
                  </View>
                  <View style={getStatusStyle(pedido.status)}>
                    <Text style={getStatusTextStyle(pedido.status)}>
                      {getStatusText(pedido.status)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.pedidoValor}>{pedido.valor}</Text>

                {/* PRODUTOS */}
                <Text style={styles.subLabel}>Produtos:</Text>
                {pedido.produtos.map((p, i) => (
                  <View key={i} style={styles.produtoRow}>
                    <Text style={styles.produtoNome}>{p.nome}</Text>
                    <Text style={styles.produtoPreco}>{p.preco}</Text>
                  </View>
                ))}

                <View style={styles.divider} />

                {/* RASTREAMENTO */}
                <Text style={styles.subLabel}>Rastreamento:</Text>
                <View style={styles.timeline}>
                  {pedido.rastreamento.map((etapa, i) => (
                    <View key={i} style={styles.timelineItem}>
                      <View style={styles.timelineLeft}>
                        <View style={[
                          styles.timelineDot,
                          etapa.feito && styles.timelineDotDone,
                        ]} />
                        {i < pedido.rastreamento.length - 1 && (
                          <View style={styles.timelineLine} />
                        )}
                      </View>
                      <View style={styles.timelineContent}>
                        <View style={styles.timelineEtapaRow}>
                          {etapa.etapa === "Em trânsito" && (
                            <Image
                              source={require("../../assets/images/caminhao-de-entrega.png")}
                              style={[
                                styles.timelineCaminhao,
                                { tintColor: etapa.feito ? "#FF40A3" : "#ccc" }
                              ]}
                            />
                          )}
                          <Text style={[
                            styles.timelineEtapa,
                            !etapa.feito && styles.timelineEtapaPendente,
                          ]}>
                            {etapa.etapa}
                          </Text>
                        </View>
                        {etapa.data ? (
                          <Text style={styles.timelineData}>{etapa.data}</Text>
                        ) : null}
                      </View>
                    </View>
                  ))}
                </View>

              </View>
            ))}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF0F5" },

  // HEADER
  header: { paddingHorizontal: 16, paddingTop: 52, paddingBottom: 16 },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  brandName: { color: "#fff", fontSize: 18, fontWeight: "700" },
  brandSub: { color: "rgba(255,255,255,0.85)", fontSize: 11 },
  logoutBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  logoutText: { color: "#fff", fontSize: 12, fontWeight: "600" },

  // PROFILE CARD
  profileCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    padding: 14,
  },
  profileLabel: { color: "#fff", fontSize: 12, fontWeight: "600" },
  profileSince: { color: "rgba(255,255,255,0.75)", fontSize: 10, marginBottom: 10 },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarIcon: { width: 22, height: 22, tintColor: "#fff" },
  profileName: { color: "#fff", fontSize: 15, fontWeight: "700" },
  profileEmail: { color: "rgba(255,255,255,0.8)", fontSize: 12 },

  // ABAS
  tabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  tab: {
    flex: 1,
    paddingVertical: 13,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: "#FF40A3" },
  tabText: { fontSize: 13, color: "#999" },
  tabTextActive: { color: "#FF40A3", fontWeight: "600" },

  scroll: { flex: 1 },
  content: { padding: 16 },

  // INFORMAÇÕES
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#FF40A3" },
  editIcon: { width: 18, height: 18, tintColor: "#FF40A3" },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 },
  infoIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FDF0F5",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  infoIconImg: { width: 16, height: 16, tintColor: "#FF40A3" },
  infoLabel: { fontSize: 11, color: "#999" },
  infoValue: { fontSize: 13, fontWeight: "600", color: "#333", flexShrink: 1 },
  divider: { height: 0.5, backgroundColor: "#f0f0f0", marginVertical: 4 },

  // PEDIDOS
  pedidoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  pedidoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  pedidoId: { fontSize: 14, fontWeight: "700", color: "#333" },
  pedidoData: { fontSize: 11, color: "#FF40A3", marginTop: 2 },
  pedidoValor: { fontSize: 20, fontWeight: "700", color: "#FF40A3", marginBottom: 12 },

  // BADGES
  badgeGreen: { backgroundColor: "#E1F5EE", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeBlue: { backgroundColor: "#E6F1FB", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeYellow: { backgroundColor: "#FFF3E0", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeTextGreen: { fontSize: 11, fontWeight: "600", color: "#0F6E56" },
  badgeTextBlue: { fontSize: 11, fontWeight: "600", color: "#185FA5" },
  badgeTextYellow: { fontSize: 11, fontWeight: "600", color: "#854F0B" },

  // PRODUTOS
  subLabel: { fontSize: 11, color: "#999", fontWeight: "600", marginBottom: 6 },
  produtoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  produtoNome: { fontSize: 12, color: "#555" },
  produtoPreco: { fontSize: 12, color: "#555" },

  // TIMELINE
  timeline: { marginTop: 8 },
  timelineItem: { flexDirection: "row", gap: 10, marginBottom: 4 },
  timelineLeft: { alignItems: "center", width: 16 },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#FF40A3",
    backgroundColor: "#fff",
    marginTop: 2,
  },
  timelineDotDone: { backgroundColor: "#FF40A3" },
  timelineLine: { width: 1.5, flex: 1, backgroundColor: "#FFB3D9", marginTop: 2 },
  timelineContent: { flex: 1, paddingBottom: 12 },
  timelineEtapaRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  timelineCaminhao: { width: 14, height: 14 },
  timelineEtapa: { fontSize: 12, fontWeight: "600", color: "#333" },
  timelineEtapaPendente: { color: "#ccc" },
  timelineData: { fontSize: 10, color: "#999", marginTop: 1 },
})