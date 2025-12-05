import "@/styles/bootstrap.min.css";
import "@/styles/globals.css";
import { Container } from "react-bootstrap";
import MainNav from "@/components/MainNav";
import RouteGuard from "@/components/RouteGuard";
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <RouteGuard>
      <MainNav />
      <Container className="py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={router.route}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
      </Container>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
          },
        }}
      />
    </RouteGuard>
  );
}
