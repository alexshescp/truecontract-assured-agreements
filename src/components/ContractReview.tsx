
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, AlertTriangle, CheckCircle, Clock, Send, Eye, Bot } from 'lucide-react';

interface ContractReviewProps {
  contractId: string;
  onBack: () => void;
  onSign: () => void;
}

const ContractReview = ({ contractId, onBack, onSign }: ContractReviewProps) => {
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  // Mock contract data
  const contract = {
    id: contractId,
    title: 'Downtown Office Lease Agreement',
    type: 'Property Rental',
    status: 'pending',
    value: '$12,000/month',
    duration: '12 months',
    counterparty: 'ABC Real Estate Corp',
    guarantor: 'CityBank Financial',
    createdDate: '2024-01-08',
    content: `
COMMERCIAL LEASE AGREEMENT

This Commercial Lease Agreement ("Agreement") is entered into on January 8, 2024, between ABC Real Estate Corp ("Landlord") and TechStart Inc ("Tenant").

PREMISES: The leased premises consist of approximately 2,500 square feet of office space located at 123 Business Avenue, Downtown District.

TERM: The lease term shall commence on February 1, 2024, and continue for twelve (12) months, ending on January 31, 2025.

RENT: Tenant agrees to pay monthly rent of $12,000, due on the first day of each month. Late fees of $100 per day will apply after a 5-day grace period.

SECURITY DEPOSIT: Tenant shall provide a security deposit of $24,000 upon signing this agreement.

USE: The premises shall be used solely for general office purposes and related business activities.

UTILITIES: Tenant is responsible for electricity, internet, and phone services. Landlord provides water, heating, and building maintenance.
    `
  };

  const aiSuggestions = [
    {
      type: 'warning',
      category: 'Legal Compliance',
      title: 'Missing Force Majeure Clause',
      description: 'Consider adding a force majeure clause to protect both parties in case of unforeseen circumstances.',
      suggestion: 'Add standard force majeure language covering natural disasters, government actions, and other uncontrollable events.'
    },
    {
      type: 'improvement',
      category: 'Payment Terms',
      title: 'Late Fee Structure',
      description: 'The current late fee of $100 per day may be considered excessive in some jurisdictions.',
      suggestion: 'Consider a percentage-based late fee (e.g., 1.5% per month) or a flat fee that complies with local regulations.'
    },
    {
      type: 'success',
      category: 'Security',
      title: 'Security Deposit Compliance',
      description: 'The security deposit amount (2x monthly rent) is within standard commercial lease practices.',
      suggestion: null
    }
  ];

  const handleAiAnalysis = () => {
    setIsAiAnalyzing(true);
    // Mock AI analysis delay
    setTimeout(() => {
      setIsAiAnalyzing(false);
    }, 3000);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      signed: { label: 'Signed', className: 'status-signed' },
      pending: { label: 'Pending Signature', className: 'status-pending' },
      executed: { label: 'Executed', className: 'status-executed' },
      cancelled: { label: 'Cancelled', className: 'status-cancelled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{contract.title}</h1>
              <p className="text-muted-foreground mt-2">
                {contract.type} • Created {contract.createdDate}
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {getStatusBadge(contract.status)}
              <span className="text-lg font-semibold text-primary">{contract.value}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="document" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="document">
                  <FileText className="h-4 w-4 mr-2" />
                  Document
                </TabsTrigger>
                <TabsTrigger value="ai-review">
                  <Bot className="h-4 w-4 mr-2" />
                  AI Review
                </TabsTrigger>
                <TabsTrigger value="blockchain">
                  <Eye className="h-4 w-4 mr-2" />
                  Blockchain
                </TabsTrigger>
              </TabsList>

              <TabsContent value="document">
                <Card>
                  <CardHeader>
                    <CardTitle>Contract Document</CardTitle>
                    <CardDescription>
                      Review the complete contract terms and conditions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                        {contract.content}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai-review">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>AI Legal Analysis</CardTitle>
                        <CardDescription>
                          Automated review for legal compliance and suggestions
                        </CardDescription>
                      </div>
                      <Button 
                        onClick={handleAiAnalysis}
                        disabled={isAiAnalyzing}
                        variant="outline"
                      >
                        {isAiAnalyzing ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Bot className="h-4 w-4 mr-2" />
                            Re-analyze
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          {getSuggestionIcon(suggestion.type)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium">{suggestion.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {suggestion.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {suggestion.description}
                            </p>
                            {suggestion.suggestion && (
                              <div className="bg-accent/50 p-3 rounded text-sm">
                                <strong>Suggestion:</strong> {suggestion.suggestion}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="blockchain">
                <Card>
                  <CardHeader>
                    <CardTitle>Blockchain Tracking</CardTitle>
                    <CardDescription>
                      Smart contract status and transaction history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="font-medium text-blue-900 mb-2">Smart Contract Status</h3>
                        <p className="text-sm text-blue-700">
                          Contract deployed on Ethereum testnet. Awaiting counterparty signature to execute.
                        </p>
                        <div className="mt-3">
                          <p className="text-xs text-blue-600">
                            Contract Address: 0x742d35Cc6634C0532925a3b8D9DD01234567890A
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="font-medium">Transaction History</h3>
                        <div className="border rounded p-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Contract Created</span>
                            <span className="text-xs text-muted-foreground">2024-01-08 14:30</span>
                          </div>
                        </div>
                        <div className="border rounded p-3 opacity-50">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Awaiting Signatures</span>
                            <span className="text-xs text-muted-foreground">Pending</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contract Details */}
            <Card>
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Counterparty</p>
                  <p className="text-sm">{contract.counterparty}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <p className="text-sm">{contract.duration}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Guarantor</p>
                  <p className="text-sm">{contract.guarantor}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Value</p>
                  <p className="text-sm font-semibold text-primary">{contract.value}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={onSign} className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Sign Contract
                </Button>
                <Button variant="outline" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send to Counterparty
                </Button>
                <Button variant="ghost" className="w-full">
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-900">Blockchain Secured</h3>
                    <p className="text-sm text-green-700">
                      This contract is secured by blockchain technology and cannot be tampered with once signed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractReview;
