
import { createContext, useContext, useState, ReactNode } from "react"

interface ProdutoCarrinho {
  id: number
  nome: string
  marca: string
  preco: string
  image: any
  quantidade: number
}

interface CarrinhoContextType {
  itens: ProdutoCarrinho[]
  adicionarItem: (produto: Omit<ProdutoCarrinho, "quantidade">) => void
  removerItem: (id: number) => void
  aumentarQuantidade: (id: number) => void
  diminuirQuantidade: (id: number) => void
  totalItens: number
  totalPreco: string
}

const CarrinhoContext = createContext<CarrinhoContextType>({} as CarrinhoContextType)

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ProdutoCarrinho[]>([])

  const adicionarItem = (produto: Omit<ProdutoCarrinho, "quantidade">) => {
    setItens((prev) => {
      const existe = prev.find((i) => i.id === produto.id)
      if (existe) {
        return prev.map((i) =>
          i.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i
        )
      }
      return [...prev, { ...produto, quantidade: 1 }]
    })
  }

  const removerItem = (id: number) => {
    setItens((prev) => prev.filter((i) => i.id !== id))
  }

  const aumentarQuantidade = (id: number) => {
    setItens((prev) =>
      prev.map((i) => i.id === id ? { ...i, quantidade: i.quantidade + 1 } : i)
    )
  }

  const diminuirQuantidade = (id: number) => {
    setItens((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantidade: Math.max(1, i.quantidade - 1) } : i
      )
    )
  }

  const totalItens = itens.reduce((acc, i) => acc + i.quantidade, 0)

  const totalPreco = itens.reduce((acc, i) => {
    const valor = parseFloat(i.preco.replace("R$ ", "").replace(",", "."))
    return acc + valor * i.quantidade
  }, 0).toFixed(2).replace(".", ",")

  return (
    <CarrinhoContext.Provider value={{
      itens,
      adicionarItem,
      removerItem,
      aumentarQuantidade,
      diminuirQuantidade,
      totalItens,
      totalPreco,
    }}>
      {children}
    </CarrinhoContext.Provider>
  )
}

export const useCarrinho = () => useContext(CarrinhoContext)