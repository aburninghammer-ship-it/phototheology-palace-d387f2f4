import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "lucide-react";
import { motion } from "framer-motion";

interface NextStep {
  id: string;
  label: string;
  checked: boolean;
  icon: string;
  action?: () => void;
}

interface StudyNextStepsProps {
  studyId: string;
  content: string;
  onContentChange?: (content: string) => void;
  readOnly?: boolean;
}

export const StudyNextSteps = ({ 
  studyId, 
  content, 
  onContentChange,
  readOnly = false 
}: StudyNextStepsProps) => {
  // Parse checkbox states from content
  const parseCheckboxStates = () => {
    const steps = [
      { id: "review", label: "Review this study", icon: "📖" },
      { id: "connect", label: "Connect to related passages", icon: "🔗" },
      { id: "apply", label: "Apply to daily life", icon: "✨" },
      { id: "share", label: "Share insights with others", icon: "💬" },
    ];

    return steps.map(step => {
      const checkedPattern = new RegExp(`-\\s*\\[x\\]\\s*${step.label}`, 'i');
      const uncheckedPattern = new RegExp(`-\\s*\\[\\s*\\]\\s*${step.label}`, 'i');
      
      return {
        ...step,
        checked: checkedPattern.test(content)
      };
    });
  };

  const [steps, setSteps] = useState<NextStep[]>(parseCheckboxStates);

  const handleCheckChange = (stepId: string, checked: boolean) => {
    if (readOnly) return;

    const step = steps.find(s => s.id === stepId);
    if (!step) return;

    // Update local state
    setSteps(prev => prev.map(s => 
      s.id === stepId ? { ...s, checked } : s
    ));

    // Update content string
    if (onContentChange) {
      const oldPattern = checked 
        ? new RegExp(`-\\s*\\[\\s*\\]\\s*${step.label}`, 'gi')
        : new RegExp(`-\\s*\\[x\\]\\s*${step.label}`, 'gi');
      
      const newText = checked 
        ? `- [x] ${step.label}`
        : `- [ ] ${step.label}`;

      const newContent = content.replace(oldPattern, newText);
      onContentChange(newContent);
    }
  };

  // Check if the Next Steps section exists in content
  const hasNextSteps = content.includes("## Next Steps") || 
                       content.includes("Review this study") ||
                       content.includes("Connect to related passages");

  if (!hasNextSteps) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-xl">📋</span>
        Next Steps
      </h3>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer
              ${step.checked 
                ? 'bg-primary/10 border border-primary/30' 
                : 'bg-muted/30 border border-border/50 hover:bg-muted/50'
              }`}
            onClick={() => handleCheckChange(step.id, !step.checked)}
          >
            <Checkbox
              checked={step.checked}
              onCheckedChange={(checked) => handleCheckChange(step.id, !!checked)}
              disabled={readOnly}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span className="text-lg">{step.icon}</span>
            <span className={`flex-1 ${step.checked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {step.label}
            </span>
            {step.checked && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-primary text-sm"
              >
                ✓
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </Card>
  );
};
