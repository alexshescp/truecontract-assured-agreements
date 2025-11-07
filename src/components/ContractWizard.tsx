import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle, Home, Scale, Shield, Upload, User } from "lucide-react";

interface ContractWizardProps {
  onBack: () => void;
  onComplete: () => void;
}

const INITIAL_FORM_STATE = {
  userRole: "",
  type: "",
  title: "",
  description: "",
  duration: "",
  paymentTerms: "",
  amount: "",
  counterparty: "",
  counterpartyEmail: "",
  useGuarantor: false,
  selectedGuarantor: "",
  documents: [] as File[],
};

const USER_ROLES = [
  {
    value: "contracting-party",
    label: "Contracting Party",
    description: "Direct party to the contract with full rights and obligations",
    icon: User,
  },
  {
    value: "legal-representative",
    label: "Legal Representative",
    description: "Lawyer or legal entity representing one of the parties",
    icon: Scale,
  },
  {
    value: "financial-guarantor",
    label: "Private Financial Guarantor",
    description: "Third party providing financial guarantees for the contract",
    icon: Shield,
  },
  {
    value: "agent-realtor",
    label: "Agent/Realtor",
    description: "Intermediary acting on behalf of one of the parties",
    icon: Home,
  },
] as const;

const CONTRACT_TYPES = [
  { value: "property", label: "Property Rental" },
  { value: "vehicle", label: "Vehicle Rental" },
  { value: "service", label: "Service Agreement" },
  { value: "freelance", label: "Freelance Contract" },
] as const;

const GUARANTORS = [
  { id: "1", name: "CityBank Financial", fee: "2.5%", rating: 4.8 },
  { id: "2", name: "SecureGuarantee Ltd", fee: "3.0%", rating: 4.6 },
  { id: "3", name: "TrustFactor Corp", fee: "2.8%", rating: 4.7 },
] as const;

const ContractWizard = ({ onBack, onComplete }: ContractWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const updateForm = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((previous) => ({ ...previous, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((previous) => previous + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((previous) => previous - 1);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    updateForm("documents", [...formData.documents, ...files]);
  };

  const isValidEmail = (value: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);
  const isPositiveAmount = (value: string) => Number(value) > 0;

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.userRole !== "";
      case 2:
        return formData.type !== "" && formData.title.trim() !== "";
      case 3:
        return (
          formData.amount !== "" &&
          isPositiveAmount(formData.amount) &&
          formData.duration !== "" &&
          formData.paymentTerms !== ""
        );
      case 4:
        return (
          formData.counterparty.trim() !== "" &&
          formData.counterpartyEmail.trim() !== "" &&
          isValidEmail(formData.counterpartyEmail)
        );
      default:
        return true;
    }
  };

  const summaryDetails = useMemo(
    () => [
      { label: "Role", value: USER_ROLES.find((role) => role.value === formData.userRole)?.label ?? "--" },
      { label: "Contract Type", value: CONTRACT_TYPES.find((type) => type.value === formData.type)?.label ?? "--" },
      { label: "Title", value: formData.title || "--" },
      { label: "Value", value: formData.amount ? `$${Number(formData.amount).toLocaleString()}` : "--" },
      { label: "Payment Terms", value: formData.paymentTerms || "--" },
      { label: "Duration", value: formData.duration || "--" },
      { label: "Counterparty", value: formData.counterparty || "--" },
      { label: "Counterparty Email", value: formData.counterpartyEmail || "--" },
      {
        label: "Guarantor",
        value: formData.useGuarantor
          ? GUARANTORS.find((guarantor) => guarantor.id === formData.selectedGuarantor)?.name ?? "--"
          : "Not requested",
      },
    ],
    [formData],
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Select Your Role</h2>
              <p className="text-muted-foreground mb-6">
                Choose your role in this contract. This determines your access rights and dashboard filtering.
              </p>
            </div>

            <RadioGroup value={formData.userRole} onValueChange={(value) => updateForm("userRole", value)} className="space-y-4">
              {USER_ROLES.map((role) => {
                const Icon = role.icon;
                return (
                  <div key={role.value} className="flex items-start space-x-3">
                    <RadioGroupItem value={role.value} id={role.value} className="mt-1" />
                    <div className="flex-1 cursor-pointer" onClick={() => updateForm("userRole", role.value)}>
                      <Label htmlFor={role.value} className="cursor-pointer">
                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                          <Icon className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{role.label}</p>
                            <p className="text-sm text-muted-foreground">{role.description}</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Contract Details</h2>
              <p className="text-muted-foreground mb-6">Define the basic information about your contract.</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="contract-type">Contract Type</Label>
                <Select value={formData.type} onValueChange={(value) => updateForm("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contract type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTRACT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Contract Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Downtown Office Lease Agreement"
                  value={formData.title}
                  onChange={(event) => updateForm("title", event.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a brief description of this contract..."
                  value={formData.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Terms &amp; Conditions</h2>
              <p className="text-muted-foreground mb-6">Define the financial and timing aspects of your contract.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Contract Value</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="10000"
                  value={formData.amount}
                  onChange={(event) => updateForm("amount", event.target.value)}
                  min={0}
                />
                {!isPositiveAmount(formData.amount || "0") && formData.amount !== "" && (
                  <p className="text-xs text-destructive mt-1">Enter a positive amount.</p>
                )}
              </div>

              <div>
                <Label htmlFor="duration">Duration</Label>
                <Select value={formData.duration} onValueChange={(value) => updateForm("duration", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-month">1 Month</SelectItem>
                    <SelectItem value="3-months">3 Months</SelectItem>
                    <SelectItem value="6-months">6 Months</SelectItem>
                    <SelectItem value="1-year">1 Year</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="payment-terms">Payment Terms</Label>
              <Select value={formData.paymentTerms} onValueChange={(value) => updateForm("paymentTerms", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="one-time">One-time Payment</SelectItem>
                  <SelectItem value="milestone">Milestone-based</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Counterparty &amp; Guarantees</h2>
              <p className="text-muted-foreground mb-6">Add the other party's information and choose payment protection.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="counterparty">Counterparty Name</Label>
                <Input
                  id="counterparty"
                  placeholder="Company or Individual Name"
                  value={formData.counterparty}
                  onChange={(event) => updateForm("counterparty", event.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="counterparty-email">Counterparty Email</Label>
                <Input
                  id="counterparty-email"
                  type="email"
                  placeholder="contact@company.com"
                  value={formData.counterpartyEmail}
                  onChange={(event) => updateForm("counterpartyEmail", event.target.value)}
                />
                {formData.counterpartyEmail !== "" && !isValidEmail(formData.counterpartyEmail) && (
                  <p className="text-xs text-destructive mt-1">Enter a valid email address.</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use-guarantor"
                  checked={formData.useGuarantor}
                  onCheckedChange={(checked) => updateForm("useGuarantor", Boolean(checked))}
                />
                <Label htmlFor="use-guarantor" className="text-sm font-medium">
                  Add Payment Guarantee (Recommended)
                </Label>
              </div>

              {formData.useGuarantor && (
                <div className="space-y-3 p-4 border rounded-lg bg-accent/20">
                  <h3 className="font-medium">Available Guarantors</h3>
                  {GUARANTORS.map((guarantor) => (
                    <div
                      key={guarantor.id}
                      className={`p-3 border rounded cursor-pointer transition-colors ${
                        formData.selectedGuarantor === guarantor.id ? "border-primary bg-primary/5" : "hover:bg-accent/50"
                      }`}
                      onClick={() => updateForm("selectedGuarantor", guarantor.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{guarantor.name}</p>
                          <p className="text-sm text-muted-foreground">Rating: {guarantor.rating}/5 ⭐</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-primary">{guarantor.fee}</p>
                          <p className="text-xs text-muted-foreground">Fee</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Documents &amp; Review</h2>
              <p className="text-muted-foreground mb-6">
                Upload supporting documents and review your contract before creation.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Upload Documents (Optional)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
                  <Input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
                  <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                    Choose Files
                  </Button>
                </div>

                {formData.documents.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.documents.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900">AI Review Ready</h3>
                      <p className="text-sm text-blue-700">
                        Once created, our AI will analyze your contract for legal compliance and suggest improvements automatically.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Submission Checklist</CardTitle>
                  <CardDescription>Confirm everything looks correct before publishing.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  {summaryDetails.map((item) => (
                    <div key={item.label}>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Create New Contract</h1>
              <span className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            {renderStep()}

            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep === totalSteps ? (
                <Button onClick={onComplete} disabled={!canProceed()}>
                  Create Contract
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleNext} disabled={!canProceed()}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractWizard;
