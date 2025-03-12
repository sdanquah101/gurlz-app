import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface ApprovalStatusProps {
  status: 'pending' | 'approved' | 'rejected';
  userType: 'vendor' | 'organization';
}

export default function ApprovalStatus({ status, userType }: ApprovalStatusProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      title: 'Application Under Review',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      message: `Your ${userType} application is being reviewed. This usually takes 1-2 business days.`
    },
    approved: {
      icon: CheckCircle2,
      title: 'Application Approved',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      message: 'Congratulations! Your application has been approved.'
    },
    rejected: {
      icon: AlertCircle,
      title: 'Application Needs Review',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      message: 'Please review and update your application details.'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${config.bgColor} p-6 rounded-xl`}
    >
      <div className="flex items-center space-x-3 mb-4">
        <Icon className={`w-6 h-6 ${config.color}`} />
        <h3 className={`font-semibold ${config.color}`}>{config.title}</h3>
      </div>
      <p className="text-gray-600">{config.message}</p>
      
      {status === 'pending' && (
        <div className="mt-4 space-y-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-yellow-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <p className="text-sm text-gray-500 text-center">
            We'll notify you once the review is complete
          </p>
        </div>
      )}
    </motion.div>
  );
}