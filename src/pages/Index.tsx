
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import LandingPage from '@/components/LandingPage';
import AuthModal from '@/components/AuthModal';
import Dashboard from '@/components/Dashboard';
import ContractWizard from '@/components/ContractWizard';
import ContractReview from '@/components/ContractReview';
import GuaranteesMarketplace from '@/components/GuaranteesMarketplace';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState('');
  const { toast } = useToast();

  const handleAuthToggle = () => {
    if (isAuthenticated) {
      setIsAuthenticated(false);
      setCurrentPage('home');
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthenticate = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
    toast({
      title: "Welcome to TrueContract!",
      description: "You've successfully signed in to your account.",
    });
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setCurrentPage('dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleCreateContract = () => {
    setCurrentPage('create-contract');
  };

  const handleViewContract = (contractId: string) => {
    setSelectedContractId(contractId);
    setCurrentPage('contract-review');
  };

  const handleContractComplete = () => {
    setCurrentPage('dashboard');
    toast({
      title: "Contract created successfully!",
      description: "Your contract has been created and is ready for review.",
    });
  };

  const handleSign = () => {
    toast({
      title: "Contract signed!",
      description: "Your digital signature has been recorded on the blockchain.",
    });
    setCurrentPage('dashboard');
  };

  const handlePageChange = (page: string) => {
    if ((page === 'dashboard' || page === 'guarantees' || page === 'settings') && !isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onGetStarted={handleGetStarted} />;
      case 'dashboard':
        return (
          <Dashboard
            onCreateContract={handleCreateContract}
            onViewContract={handleViewContract}
          />
        );
      case 'create-contract':
        return (
          <ContractWizard
            onBack={() => setCurrentPage('dashboard')}
            onComplete={handleContractComplete}
          />
        );
      case 'contract-review':
        return (
          <ContractReview
            contractId={selectedContractId}
            onBack={() => setCurrentPage('dashboard')}
            onSign={handleSign}
          />
        );
      case 'guarantees':
        return (
          <GuaranteesMarketplace
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      case 'settings':
        return (
          <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-8">Settings</h1>
              <p className="text-muted-foreground">Settings page coming soon...</p>
            </div>
          </div>
        );
      default:
        return <LandingPage onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        currentPage={currentPage}
        onPageChange={handlePageChange}
        isAuthenticated={isAuthenticated}
        onAuthToggle={handleAuthToggle}
      />
      
      {renderCurrentPage()}
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthenticate={handleAuthenticate}
      />
    </div>
  );
};

export default Index;
