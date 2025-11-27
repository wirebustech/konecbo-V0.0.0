import Header from '@/components/konecbo/header';
import Hero from '@/components/konecbo/hero';
import ProductInfo from '@/components/konecbo/product-info';
import Footer from '@/components/konecbo/footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow dark:bg-gray-900">
        <Hero />
        <ProductInfo />
      </main>
      <Footer />
    </div>
  );
}
