import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from '../models/Job';

dotenv.config();

const sampleJobs = [
  {
    title: 'Senior Software Engineer',
    company: 'Google',
    companyLogo: 'https://logo.clearbit.com/google.com',
    location: 'Mountain View, CA',
    type: 'Full-time',
    experience: '5+ years',
    salary: '$150,000 - $250,000',
    description: 'Join Google as a Senior Software Engineer to build innovative products that impact billions of users.',
    requirements: ['5+ years of software development experience', 'Strong knowledge of data structures and algorithms', 'Experience with distributed systems'],
    skills: ['Python', 'Java', 'Go', 'Kubernetes', 'System Design'],
    benefits: ['Health Insurance', 'Stock Options', 'Free Meals', 'Gym Membership'],
    referralReward: 5000,
    status: 'active'
  },
  {
    title: 'Frontend Developer',
    company: 'Meta',
    companyLogo: 'https://logo.clearbit.com/meta.com',
    location: 'Menlo Park, CA',
    type: 'Full-time',
    experience: '3+ years',
    salary: '$130,000 - $200,000',
    description: 'Build the next generation of social experiences at Meta.',
    requirements: ['3+ years React experience', 'Strong JavaScript/TypeScript skills', 'Experience with modern frontend tools'],
    skills: ['React', 'TypeScript', 'GraphQL', 'CSS', 'Jest'],
    benefits: ['Health Insurance', 'RSUs', 'Remote Work', 'Learning Budget'],
    referralReward: 4000,
    status: 'active'
  },
  {
    title: 'Machine Learning Engineer',
    company: 'Amazon',
    companyLogo: 'https://logo.clearbit.com/amazon.com',
    location: 'Seattle, WA',
    type: 'Full-time',
    experience: '4+ years',
    salary: '$140,000 - $220,000',
    description: 'Work on cutting-edge ML systems powering Amazon\'s recommendation engines.',
    requirements: ['4+ years ML experience', 'Strong Python skills', 'Experience with TensorFlow or PyTorch'],
    skills: ['Python', 'TensorFlow', 'PyTorch', 'AWS', 'SQL'],
    benefits: ['Health Insurance', 'Stock Options', '401k Match', 'Relocation'],
    referralReward: 4500,
    status: 'active'
  },
  {
    title: 'DevOps Engineer',
    company: 'Stripe',
    companyLogo: 'https://logo.clearbit.com/stripe.com',
    location: 'San Francisco, CA',
    type: 'Full-time',
    experience: '3+ years',
    salary: '$120,000 - $180,000',
    description: 'Build and maintain infrastructure for Stripe\'s payment platform.',
    requirements: ['3+ years DevOps experience', 'Strong knowledge of CI/CD', 'Experience with cloud platforms'],
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Python'],
    benefits: ['Health Insurance', 'Equity', 'Unlimited PTO', 'Remote Work'],
    referralReward: 3500,
    status: 'active'
  },
  {
    title: 'Product Manager',
    company: 'Microsoft',
    companyLogo: 'https://logo.clearbit.com/microsoft.com',
    location: 'Redmond, WA',
    type: 'Full-time',
    experience: '5+ years',
    salary: '$130,000 - $200,000',
    description: 'Lead product strategy for Microsoft Azure services.',
    requirements: ['5+ years PM experience', 'Technical background', 'Strong communication skills'],
    skills: ['Product Strategy', 'Agile', 'Data Analysis', 'Stakeholder Management'],
    benefits: ['Health Insurance', 'Stock Options', 'Flexible Hours', 'Education Budget'],
    referralReward: 3000,
    status: 'active'
  },
  {
    title: 'Full Stack Developer',
    company: 'Netflix',
    companyLogo: 'https://logo.clearbit.com/netflix.com',
    location: 'Los Gatos, CA',
    type: 'Full-time',
    experience: '4+ years',
    salary: '$140,000 - $210,000',
    description: 'Build features for Netflix\'s streaming platform used by millions.',
    requirements: ['4+ years full stack experience', 'Strong JavaScript skills', 'Experience with microservices'],
    skills: ['React', 'Node.js', 'Java', 'AWS', 'MongoDB'],
    benefits: ['Health Insurance', 'Unlimited PTO', 'Stock Options', 'Free Netflix'],
    referralReward: 4000,
    status: 'active'
  },
  {
    title: 'Data Scientist',
    company: 'Apple',
    companyLogo: 'https://logo.clearbit.com/apple.com',
    location: 'Cupertino, CA',
    type: 'Full-time',
    experience: '3+ years',
    salary: '$130,000 - $190,000',
    description: 'Analyze data to improve Apple products and services.',
    requirements: ['3+ years data science experience', 'Strong statistical knowledge', 'Python/R proficiency'],
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics'],
    benefits: ['Health Insurance', 'RSUs', 'Product Discounts', 'Gym Membership'],
    referralReward: 3500,
    status: 'active'
  },
  {
    title: 'Backend Engineer',
    company: 'Uber',
    companyLogo: 'https://logo.clearbit.com/uber.com',
    location: 'San Francisco, CA',
    type: 'Full-time',
    experience: '3+ years',
    salary: '$125,000 - $185,000',
    description: 'Build scalable backend systems for Uber\'s ride-sharing platform.',
    requirements: ['3+ years backend experience', 'Strong system design skills', 'Experience with microservices'],
    skills: ['Go', 'Python', 'PostgreSQL', 'Redis', 'Kafka'],
    benefits: ['Health Insurance', 'Equity', 'Free Rides', 'Meal Stipend'],
    referralReward: 3000,
    status: 'active'
  }
];

async function seedJobs() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/referus');
    console.log('Connected to MongoDB');

    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    await Job.insertMany(sampleJobs);
    console.log(`Seeded ${sampleJobs.length} jobs`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding jobs:', error);
    process.exit(1);
  }
}

seedJobs();
