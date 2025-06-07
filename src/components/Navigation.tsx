
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogIn, User, Home, FileText, Shield, Settings } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isAuthenticated: boolean;
  onAuthToggle: () => void;
}

const Navigation = ({ currentPage, onPageChange, isAuthenticated, onAuthToggle }: NavigationProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: FileText, requiresAuth: true },
    { id: 'guarantees', label: 'Guarantees', icon: Shield, requiresAuth: true },
    { id: 'settings', label: 'Settings', icon: Settings, requiresAuth: true },
  ];

  const filteredNavItems = navItems.filter(item => !item.requiresAuth || isAuthenticated);

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => onPageChange('home')}
              className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              TrueContract
            </button>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Button>
                
                {isProfileOpen && (
                  <Card className="absolute right-0 mt-2 w-48 p-2 shadow-lg z-50">
                    <div className="space-y-2">
                      <div className="px-3 py-2 text-sm text-muted-foreground border-b">
                        john@example.com
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onPageChange('settings');
                          setIsProfileOpen(false);
                        }}
                        className="w-full justify-start"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onAuthToggle();
                          setIsProfileOpen(false);
                        }}
                        className="w-full justify-start text-destructive hover:text-destructive"
                      >
                        Sign out
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            ) : (
              <Button 
                onClick={onAuthToggle}
                className="flex items-center space-x-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
