import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Container } from '@mui/material';
import ConsensusResultComponent from '../components/ConsensusResult';

interface LocationState {
  consensusData: {
    consensusTheme?: {
      title: string;
      description: string;
    };
    characters: any[];
    consensusResults?: Array<{
      question: string;
      selectedAnswer: string;
      consistency: number;
      category: string;
    }>;
    equipment?: any;
  };
}

const ConsensusResultPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();

  const handleGoBack = () => {
    history.goBack();
  };

  // 检查是否有传递的数据
  const consensusData = location.state?.consensusData;

  if (!consensusData) {
    // 如果没有数据，使用默认数据或重定向
    const defaultData = {
      consensusTheme: {
        title: '共识活动',
        description: '团队协作决策'
      },
      characters: [
        { id: 'cha1', name: '参与者1', avatar: '/src/assets/game/characters/cha1.jpg' },
        { id: 'cha2', name: '参与者2', avatar: '/src/assets/game/characters/cha2.jpg' }
      ],
      consensusResults: [
        {
          question: '预算分配方案',
          selectedAnswer: '均衡分配',
          consistency: 0.85,
          category: 'budget'
        },
        {
          question: '时间安排选择',
          selectedAnswer: '灵活安排',
          consistency: 0.72,
          category: 'time'
        }
      ],
      equipment: {
        budgetAmulet: {
          range: [300, 600],
          level: '舒适型',
          enabled: true
        },
        timeCompass: {
          duration: 'full-day',
          enabled: true
        },
        attractionShield: {
          preferences: ['热门景点', '自然风光'],
          enabled: true
        },
        cuisineGem: {
          types: ['当地特色', '小吃'],
          enabled: true
        },
        transportationKey: {
          preferences: ['公共交通'],
          enabled: true
        },
        atmosphereRing: {
          preferences: ['休闲放松'],
          enabled: true
        }
      }
    };

    return (
      <Container maxWidth="md" sx={{ p: 0 }}>
        <ConsensusResultComponent 
          data={defaultData}
          onBack={handleGoBack}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ p: 0 }}>
      <ConsensusResultComponent 
        data={consensusData}
        onBack={handleGoBack}
      />
    </Container>
  );
};

export default ConsensusResultPage;