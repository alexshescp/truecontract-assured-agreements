
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Star, Shield, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface GuaranteesMarketplaceProps {
  onBack: () => void;
}

const GuaranteesMarketplace = ({ onBack }: GuaranteesMarketplaceProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const guarantors = [
    {
      id: '1',
      name: 'CityBank Financial',
      category: 'Traditional Bank',
      rating: 4.8,
      reviews: 1247,
      fee: '2.5%',
      maxCoverage: '$500K',
      processingTime: '24 hours',
      specialties: ['Property Rentals', 'Commercial Leases'],
      features: ['Insurance Coverage', '24/7 Support', 'Legal Assistance'],
      verified: true,
      description: 'Leading financial institution with over 50 years of experience in commercial guarantees and escrow services.'
    },
    {
      id: '2',
      name: 'SecureGuarantee Ltd',
      category: 'Fintech',
      rating: 4.6,
      reviews: 892,
      fee: '3.0%',
      maxCoverage: '$250K',
      processingTime: '12 hours',
      specialties: ['Vehicle Rentals', 'Equipment Leasing'],
      features: ['Instant Approval', 'Mobile App', 'API Integration'],
      verified: true,
      description: 'Modern fintech company specializing in fast, technology-driven guarantee solutions for the digital age.'
    },
    {
      id: '3',
      name: 'TrustFactor Corp',
      category: 'Insurance',
      rating: 4.7,
      reviews: 654,
      fee: '2.8%',
      maxCoverage: '$1M',
      processingTime: '6 hours',
      specialties: ['Service Agreements', 'Freelance Contracts'],
      features: ['Risk Assessment', 'Fraud Protection', 'Claims Support'],
      verified: true,
      description: 'Insurance-backed guarantee provider offering comprehensive coverage for service-based contracts.'
    },
    {
      id: '4',
      name: 'DeFi Guarantee Protocol',
      category: 'DeFi',
      rating: 4.4,
      reviews: 423,
      fee: '1.8%',
      maxCoverage: '$100K',
      processingTime: '2 hours',
      specialties: ['Crypto Payments', 'Smart Contracts'],
      features: ['Decentralized', 'Low Fees', 'Crypto Native'],
      verified: false,
      description: 'Decentralized protocol providing guarantee services through smart contracts and community governance.'
    },
    {
      id: '5',
      name: 'GlobalTrade Guarantees',
      category: 'Trade Finance',
      rating: 4.9,
      reviews: 1834,
      fee: '3.5%',
      maxCoverage: '$2M',
      processingTime: '48 hours',
      specialties: ['International Trade', 'Large Contracts'],
      features: ['Global Coverage', 'Multi-Currency', 'Trade Expertise'],
      verified: true,
      description: 'International trade finance specialist with global reach and expertise in large-scale commercial guarantees.'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Traditional Bank', label: 'Traditional Banks' },
    { value: 'Fintech', label: 'Fintech Companies' },
    { value: 'Insurance', label: 'Insurance Providers' },
    { value: 'DeFi', label: 'DeFi Protocols' },
    { value: 'Trade Finance', label: 'Trade Finance' }
  ];

  const filteredGuarantors = guarantors.filter(guarantor => {
    const matchesSearch = guarantor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guarantor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guarantor.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || guarantor.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedGuarantors = [...filteredGuarantors].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'fee':
        return parseFloat(a.fee) - parseFloat(b.fee);
      case 'speed':
        return parseInt(a.processingTime) - parseInt(b.processingTime);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-foreground">Financial Guarantees Marketplace</h1>
            <p className="text-muted-foreground mt-2">
              Choose from trusted financial guarantors to secure your contract payments
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search guarantors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="fee">Lowest Fee</SelectItem>
                  <SelectItem value="speed">Fastest Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {sortedGuarantors.length} guarantor{sortedGuarantors.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="grid gap-6">
            {sortedGuarantors.map((guarantor) => (
              <Card key={guarantor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid lg:grid-cols-4 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-xl font-semibold">{guarantor.name}</h3>
                            {guarantor.verified && (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <Badge variant="outline">{guarantor.category}</Badge>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="font-medium">{guarantor.rating}</span>
                            <span className="text-sm text-muted-foreground">
                              ({guarantor.reviews} reviews)
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-primary">{guarantor.fee}</p>
                          <p className="text-xs text-muted-foreground">Processing fee</p>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{guarantor.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {guarantor.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Shield className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Max Coverage</span>
                        </div>
                        <p className="text-lg font-semibold">{guarantor.maxCoverage}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">Processing Time</span>
                        </div>
                        <p className="text-lg font-semibold">{guarantor.processingTime}</p>
                      </div>
                    </div>

                    {/* Features & Action */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Features</h4>
                        <ul className="space-y-1">
                          {guarantor.features.map((feature, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-center">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <Button className="w-full">
                          Select Guarantor
                        </Button>
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">How Payment Guarantees Work</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Financial guarantors ensure that payments are made on time according to your contract terms. 
                  If the paying party defaults, the guarantor covers the payment and handles collection.
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Choose a guarantor based on coverage needs and processing speed</li>
                  <li>• Guarantor verifies contract terms and assesses risk</li>
                  <li>• Your contract is backed by the guarantor's financial strength</li>
                  <li>• Automatic payment execution reduces delays and disputes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuaranteesMarketplace;
