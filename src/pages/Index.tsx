const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-xl px-6">
        <h1 className="text-4xl font-bold mb-4">ESN Store</h1>
        <p className="text-muted-foreground mb-6">
          Bem-vindo. Acesse a loja para ver produtos e coleções.
        </p>
        <a
          href="/store/index.html"
          className="inline-block px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold"
        >
          Entrar na loja
        </a>
      </div>
    </div>
  );
};

export default Index;
