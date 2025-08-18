import Phaser from 'phaser';

interface ConflictQuestion {
  id: string;
  type: 'choice' | 'fill' | 'sort';
  question: string;
  options?: string[];
  correctAnswer?: number | string | string[];
  explanation: string;
  category: string;
}

interface ConsensusResult {
  question: string;
  selectedAnswer: string;
  consistency: number;
  category: string;
}

interface VictoryData {
  victory: boolean;
  characters: any[];
  monsters?: any[];
  consensusResults?: ConsensusResult[];
  consensusTheme?: {
    title: string;
    description: string;
  };
  maxParticipants?: number;
}

export class VictoryScene extends Phaser.Scene {
  private victoryData?: VictoryData;
  private eventCallback?: (event: string, data?: any) => void;

  constructor() {
    super({ key: 'VictoryScene' });
  }

  init(data: VictoryData) {
    this.victoryData = data;
    console.log('🏆 胜利页面数据:', data);
  }

  preload() {
    // 加载卡片背景图片
    this.load.image('card_bg1', '/src/assets/game/ui/card-background1.png');
    this.load.image('card_bg2', '/src/assets/game/ui/card-background2.png');
    
    // 加载角色图片
    this.load.image('character1', '/src/assets/game/characters/cha1.jpg');
    this.load.image('character2', '/src/assets/game/characters/cha2.jpg');
    this.load.image('character3', '/src/assets/game/characters/cha3.jpg');
    this.load.image('character4', '/src/assets/game/characters/cha4.jpg');
    
    // 加载怪物图片
    this.load.image('monster1', '/src/assets/game/monsters/monster1.png');
    this.load.image('monster2', '/src/assets/game/monsters/monster2.jpg');
    this.load.image('monster3', '/src/assets/game/monsters/monster3.jpg');
    this.load.image('monster4', '/src/assets/game/monsters/monster4.jpg');
  }

  create() {
    // 创建AI生成的背景
    this.createGameBackground();
    
    // 创建居中的共识成果卡片
    this.createConsensusCard();
    
    // 添加操作按钮
    this.createActionButtons();
  }

  private createGameBackground() {
    // 如果有AI生成的背景图，使用它
    const backgroundUrl = (this.victoryData as any)?.backgroundUrl;
    if (backgroundUrl) {
      // 加载并显示AI生成的背景
      this.load.image('ai_background', backgroundUrl);
      this.load.start();
      this.load.once('complete', () => {
        const bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'ai_background');
        bg.setDisplaySize(this.scale.width, this.scale.height);
        bg.setAlpha(0.7); // 稍微透明，避免影响卡片可读性
      });
    } else {
      // 创建默认渐变背景
      const bg = this.add.graphics();
      bg.fillGradientStyle(0x667eea, 0x764ba2, 0x667eea, 0x764ba2, 1);
      bg.fillRect(0, 0, this.scale.width, this.scale.height);
    }

    // 添加闪烁星星效果
    this.createStarEffect();
  }

  private createConsensusCard() {
    // 创建居中的共识成果卡片
    const cardWidth = Math.min(this.scale.width * 0.85, 400); // 限制最大宽度
    const cardHeight = Math.min(this.scale.height * 0.75, 600); // 限制最大高度
    const cardX = (this.scale.width - cardWidth) / 2;
    const cardY = (this.scale.height - cardHeight) / 2;

    // 添加卡片阴影效果
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillRoundedRect(cardX + 6, cardY + 6, cardWidth, cardHeight, 20);

    // 使用卡片背景图片 - 随机选择一个背景
    const bgKey = Math.random() > 0.5 ? 'card_bg1' : 'card_bg2';
    const cardBg = this.add.image(cardX + cardWidth/2, cardY + cardHeight/2, bgKey);
    cardBg.setDisplaySize(cardWidth, cardHeight);
    cardBg.setOrigin(0.5);

    // 暂时移除卡片入场动画以修复图片缩放问题
    // cardBg.setScale(0);
    // shadow.setScale(0);
    // this.tweens.add({
    //   targets: [cardBg, shadow],
    //   scaleX: 1,
    //   scaleY: 1,
    //   duration: 800,
    //   ease: 'Back.easeOut'
    // });
    
    // 直接设置为正常尺寸
    cardBg.setScale(1);
    shadow.setScale(1);
    console.log('🃏 跳过卡片缩放动画，直接显示');

    // 创建卡片内容
    this.createCardContent(cardX, cardY, cardWidth, cardHeight);
  }

  private createCardContent(cardX: number, cardY: number, cardWidth: number, cardHeight: number) {
    const centerX = this.scale.width / 2;
    
    // 胜利标题
    const victoryText = this.add.text(centerX, cardY + 40, '🎉 共识达成！', {
      fontSize: `${Math.min(cardWidth, cardHeight) * 0.12}px`,
      color: '#FF6B6B',
      fontStyle: 'bold',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // 共识主题
    const title = this.victoryData?.consensusTheme?.title || '共识活动';
    const titleText = this.add.text(centerX, cardY + 90, `「${title}」`, {
      fontSize: `${Math.min(cardWidth, cardHeight) * 0.09}px`,
      color: '#2C3E50',
      fontStyle: 'bold',
      wordWrap: { width: cardWidth * 0.8, useAdvancedWrap: true },
      align: 'center'
    }).setOrigin(0.5);

    // 日期和状态
    const currentDate = new Date().toLocaleDateString('zh-CN');
    const statusText = this.add.text(centerX, cardY + 140, `${currentDate} · 共识达成`, {
      fontSize: `${Math.min(cardWidth, cardHeight) * 0.06}px`,
      color: '#7F8C8D',
      fontStyle: 'normal'
    }).setOrigin(0.5);

    // 参与者和怪兽区域
    this.createCharactersAndMonstersSection(cardX, cardY + 180, cardWidth, cardHeight - 280);

    // 共识成果摘要
    this.createConsensusResultsSection(cardX, cardY + cardHeight - 140, cardWidth);

    // Hopa 品牌标识
    const brandText = this.add.text(centerX, cardY + cardHeight - 30, 'Hopa · AI共识助手', {
      fontSize: `${Math.min(cardWidth, cardHeight) * 0.055}px`,
      color: '#FF6B6B',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // 给所有文本添加入场动画
    const allTexts = [victoryText, titleText, statusText, brandText];
    allTexts.forEach((text, index) => {
      text.setAlpha(0);
      this.tweens.add({
        targets: text,
        alpha: 1,
        y: text.y - 10,
        duration: 600,
        delay: 300 + index * 150,
        ease: 'Power2.easeOut'
      });
    });
  }

  private createCharactersAndMonstersSection(x: number, y: number, width: number, height: number) {
    const centerX = this.scale.width / 2;
    const sectionHeight = height / 2;
    
    // 参与者区域
    const participantsLabel = this.add.text(centerX, y + 10, '🎭 参与共识', {
      fontSize: `${Math.min(width, height) * 0.09}px`,
      color: '#34495E',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // 显示实际参与的角色
    const actualCharacters = this.victoryData?.characters || [];
    const participantCount = Math.min(actualCharacters.length, 4);
    
    console.log('🎭 VictoryScene接收到的角色数据:', {
      totalCharacters: actualCharacters.length,
      characters: actualCharacters,
      participantCount: participantCount
    });
    
    if (participantCount > 0) {
      const avatarSize = Math.min(width / (participantCount + 1), 40); // 进一步减小尺寸到40
      const avatarSpacing = width * 0.8 / participantCount;
      const startX = centerX - ((participantCount - 1) * avatarSpacing / 2);

      for (let i = 0; i < participantCount; i++) {
        const character = actualCharacters[i];
        const avatarX = startX + i * avatarSpacing;
        const avatarY = y + 50;

        // 使用角色的实际图片 - 多种数据源兼容
        console.log('🎭 角色数据:', character);
        
        let characterKey = null;
        
        // 1. 尝试从character.character.image获取
        if (character?.character?.image) {
          characterKey = character.character.image;
        }
        // 2. 尝试从character.image获取
        else if (character?.image) {
          characterKey = character.image;
        }
        // 3. 尝试从ID解析
        else {
          const characterId = character?.character?.id || character?.id || `cha${(i % 4) + 1}`;
          if (characterId.startsWith('char')) {
            // 处理'char1', 'char2'等格式
            const numMatch = characterId.match(/\d+/);
            const characterIndex = numMatch ? parseInt(numMatch[0]) : (i % 4) + 1;
            characterKey = `character${characterIndex}`;
          } else if (characterId.startsWith('cha')) {
            // 处理'cha1', 'cha2'等格式  
            const characterIndex = parseInt(characterId.replace('cha', '')) || (i % 4) + 1;
            characterKey = `character${characterIndex}`;
          } else {
            // 回退方案
            characterKey = `character${(i % 4) + 1}`;
          }
        }
        
        // 4. 确保characterKey有效
        if (!characterKey) {
          characterKey = `character${(i % 4) + 1}`;
        }
        
        console.log('🎭 使用角色图片key:', characterKey, '位置:', avatarX, avatarY, '尺寸:', avatarSize);
        
        // 检查图片是否存在，如果不存在则使用默认图片
        let finalCharacterKey = characterKey;
        if (!this.textures.exists(characterKey)) {
          console.warn(`⚠️ 角色图片 ${characterKey} 不存在，使用默认图片`);
          finalCharacterKey = `character${(i % 4) + 1}`;
        }
        
        console.log('✅ 最终使用的角色图片key:', finalCharacterKey);
        
        const avatar = this.add.image(avatarX, avatarY, finalCharacterKey);
        
        // 检查原始图片尺寸
        const texture = this.textures.get(finalCharacterKey);
        console.log('🎭 角色图片原始尺寸:', texture.source[0].width, 'x', texture.source[0].height);
        
        // 强制设置显示尺寸
        avatar.setDisplaySize(avatarSize, avatarSize);
        avatar.setOrigin(0.5);
        avatar.setVisible(true); // 确保可见
        avatar.setAlpha(1); // 确保不透明
        
        console.log('🎭 角色图片设置后尺寸:', avatar.displayWidth, 'x', avatar.displayHeight, '缩放:', avatar.scaleX, 'x', avatar.scaleY);
        
        // 暂时移除圆形遮罩进行调试
        // const mask = this.add.graphics();
        // mask.fillStyle(0xffffff);
        // mask.fillCircle(avatarX, avatarY, avatarSize / 2);
        // avatar.setMask(mask.createGeometryMask());
        
        console.log('🎭 角色图片创建完成:', finalCharacterKey, '可见性:', avatar.visible, '透明度:', avatar.alpha);

        // 暂时移除边框进行调试
        // const border = this.add.graphics();
        // border.lineStyle(3, 0x3498DB);
        // border.strokeCircle(avatarX, avatarY, avatarSize / 2);

        // 暂时移除头像动画，直接显示图片
        // avatar.setScale(0);
        // this.tweens.add({
        //   targets: avatar,
        //   scaleX: 1,
        //   scaleY: 1,
        //   duration: 500,
        //   delay: 800 + i * 150,
        //   ease: 'Back.easeOut'
        // });
        
        // 直接设置最终状态 - 保持setDisplaySize设置的缩放
        console.log('🎭 保持角色图片显示尺寸，跳过缩放动画');
        // this.tweens.add({
        //   targets: border,
        //   alpha: 1,
        //   duration: 300,
        //   delay: 1000 + i * 150
        // });
      }
    }

    // 打败的怪兽区域
    const monstersLabel = this.add.text(centerX, y + sectionHeight + 20, '👹 击败的分歧', {
      fontSize: `${Math.min(width, height) * 0.09}px`,
      color: '#E74C3C',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // 显示实际击败的怪兽
    const defeatedMonsters = this.victoryData?.monsters || [];
    const monsterCount = Math.min(defeatedMonsters.length, 4);
    
    console.log('👹 VictoryScene接收到的怪物数据:', {
      totalMonsters: defeatedMonsters.length,
      monsters: defeatedMonsters,
      monsterCount: monsterCount
    });
    
    if (monsterCount > 0) {
      const monsterSize = Math.min(width / (monsterCount + 1), 30); // 进一步减小怪物尺寸到30
      const monsterSpacing = width * 0.6 / monsterCount;
      const monsterStartX = centerX - ((monsterCount - 1) * monsterSpacing / 2);

      for (let i = 0; i < monsterCount; i++) {
        const monster = defeatedMonsters[i];
        const monsterX = monsterStartX + i * monsterSpacing;
        const monsterY = y + sectionHeight + 60;

        // 使用怪兽的实际图片 - 优先使用战斗中的怪物数据
        console.log('👹 怪物数据:', monster);
        
        let monsterIndex = 1; // 默认值
        
        // 优先从战斗数据中获取怪物信息
        const monsterId = monster?.id || monster?.name || monster?.monsterId || '';
        const monsterType = monster?.type || monster?.category || '';
        const battleMonsterIndex = monster?.battleIndex || monster?.index;
        
        // 1. 如果有战斗索引，直接使用
        if (battleMonsterIndex !== undefined && battleMonsterIndex >= 1 && battleMonsterIndex <= 4) {
          monsterIndex = battleMonsterIndex;
        }
        // 2. 根据怪物ID和类型智能映射
        else if (monsterId === 'consensus_monster') {
          // 共识怪物根据类型选择图片
          const typeMapping: {[key: string]: number} = {
            'budget': 1,
            'time': 2, 
            'preference': 3,
            'attraction': 3,
            'cuisine': 4,
            'conflict': 4
          };
          monsterIndex = typeMapping[monsterType] || 1;
        }
        // 3. 处理monster1, monster2等直接格式
        else if (monsterId.includes('monster')) {
          const numMatch = monsterId.match(/monster(\d+)/);
          if (numMatch) {
            monsterIndex = parseInt(numMatch[1]) || 1;
          }
        }
        // 4. 如果ID是纯数字
        else if (/^\d+$/.test(monsterId)) {
          monsterIndex = parseInt(monsterId) || 1;
        }
        
        // 确保索引在有效范围内(1-4)
        monsterIndex = Math.max(1, Math.min(4, monsterIndex));
        
        const monsterKey = `monster${monsterIndex}`;
        console.log('👹 使用怪物图片key:', monsterKey, '(原始ID:', monsterId, ', type:', monsterType, ', battleIndex:', battleMonsterIndex, ')');
        
        // 检查怪物图片是否存在
        let finalMonsterKey = monsterKey;
        if (!this.textures.exists(monsterKey)) {
          console.warn(`⚠️ 怪物图片 ${monsterKey} 不存在，使用默认图片`);
          finalMonsterKey = 'monster1';
        }
        
        const monsterSprite = this.add.image(monsterX, monsterY, finalMonsterKey);
        
        // 检查怪物图片原始尺寸
        const monsterTexture = this.textures.get(finalMonsterKey);
        console.log('👹 怪物图片原始尺寸:', monsterTexture.source[0].width, 'x', monsterTexture.source[0].height);
        
        // 强制设置显示尺寸
        monsterSprite.setDisplaySize(monsterSize, monsterSize);
        monsterSprite.setOrigin(0.5);
        monsterSprite.setVisible(true); // 确保可见
        monsterSprite.setTint(0x666666); // 变灰表示被击败
        monsterSprite.setAlpha(0.7);
        
        console.log('👹 怪物图片设置后尺寸:', monsterSprite.displayWidth, 'x', monsterSprite.displayHeight, '缩放:', monsterSprite.scaleX, 'x', monsterSprite.scaleY);
        console.log('👹 怪物图片创建完成:', finalMonsterKey, '位置:', monsterX, monsterY, '目标尺寸:', monsterSize);

        // 添加击败效果
        const strikeThrough = this.add.graphics();
        strikeThrough.lineStyle(4, 0xFF0000);
        strikeThrough.lineBetween(
          monsterX - monsterSize/2, monsterY - monsterSize/2,
          monsterX + monsterSize/2, monsterY + monsterSize/2
        );

        // 暂时移除怪兽动画，直接显示
        // monsterSprite.setScale(0);
        // strikeThrough.setAlpha(0);
        // this.tweens.add({
        //   targets: monsterSprite,
        //   scaleX: 1,
        //   scaleY: 1,
        //   duration: 400,
        //   delay: 1200 + i * 100,
        //   ease: 'Bounce.easeOut'
        // });
        // this.tweens.add({
        //   targets: strikeThrough,
        //   alpha: 1,
        //   duration: 200,
        //   delay: 1500 + i * 100
        // });
        
        // 直接设置最终状态 - 保持setDisplaySize设置的缩放
        strikeThrough.setAlpha(1);
        console.log('👹 保持怪物图片显示尺寸，跳过缩放动画');
      }
    }

    // 如果没有数据，显示占位信息
    if (participantCount === 0) {
      const noDataText = this.add.text(centerX, y + 50, '暂无参与角色信息', {
        fontSize: `${Math.min(width, height) * 0.04}px`,
        color: '#95A5A6',
        fontStyle: 'italic'
      }).setOrigin(0.5);
      
      noDataText.setAlpha(0);
      this.tweens.add({
        targets: noDataText,
        alpha: 1,
        duration: 400,
        delay: 800
      });
    }

    if (monsterCount === 0) {
      const noMonstersText = this.add.text(centerX, y + sectionHeight + 60, '完美达成，无分歧需要解决！', {
        fontSize: `${Math.min(width, height) * 0.04}px`,
        color: '#95A5A6',
        fontStyle: 'italic'
      }).setOrigin(0.5);
      
      noMonstersText.setAlpha(0);
      this.tweens.add({
        targets: noMonstersText,
        alpha: 1,
        duration: 400,
        delay: 1200
      });
    }

    // 标签动画
    [participantsLabel, monstersLabel].forEach((label, index) => {
      label.setAlpha(0);
      this.tweens.add({
        targets: label,
        alpha: 1,
        duration: 400,
        delay: 600 + index * 300,
        ease: 'Power2.easeOut'
      });
    });
  }

  private createConsensusResultsSection(_x: number, y: number, width: number) {
    const centerX = this.scale.width / 2;
    
    // 共识成果标题
    const resultsLabel = this.add.text(centerX, y + 10, '📊 共识成果', {
      fontSize: `${Math.min(width, 100) * 0.09}px`,
      color: '#27AE60',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // 显示共识统计
    const consensusResults = this.victoryData?.consensusResults || [];
    const totalQuestions = Math.max(consensusResults.length, 3);
    const consensusRate = consensusResults.length > 0 
      ? Math.round((consensusResults.reduce((sum, r) => sum + r.consistency, 0) / consensusResults.length) * 100)
      : 85; // 默认值

    // 共识率显示
    const rateText = this.add.text(centerX, y + 45, `共识率: ${consensusRate}%`, {
      fontSize: `${Math.min(width, 100) * 0.075}px`,
      color: consensusRate >= 80 ? '#27AE60' : consensusRate >= 60 ? '#F39C12' : '#E74C3C',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // 问题统计
    const questionText = this.add.text(centerX, y + 75, `解决分歧: ${totalQuestions} 个`, {
      fontSize: `${Math.min(width, 100) * 0.068}px`,
      color: '#34495E'
    }).setOrigin(0.5);

    // 成就等级
    let achievement = '';
    if (consensusRate >= 90) achievement = '🏆 完美共识';
    else if (consensusRate >= 80) achievement = '🥇 优秀共识';
    else if (consensusRate >= 70) achievement = '🥈 良好共识';
    else achievement = '🥉 基础共识';

    const achievementText = this.add.text(centerX, y + 105, achievement, {
      fontSize: `${Math.min(width, 100) * 0.068}px`,
      color: '#9B59B6',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // 成果动画
    [resultsLabel, rateText, questionText, achievementText].forEach((text, index) => {
      text.setAlpha(0);
      this.tweens.add({
        targets: text,
        alpha: 1,
        y: text.y - 5,
        duration: 400,
        delay: 1800 + index * 200,
        ease: 'Power2.easeOut'
      });
    });
  }

  private createStarEffect() {
    // 创建多层次星星背景效果
    for (let i = 0; i < 30; i++) {
      const starType = Phaser.Math.Between(0, 2);
      const starEmoji = starType === 0 ? '✨' : starType === 1 ? '⭐' : '🌟';
      
      const star = this.add.text(
        Phaser.Math.Between(0, this.scale.width),
        Phaser.Math.Between(0, this.scale.height),
        starEmoji,
        { fontSize: `${Phaser.Math.Between(8, 20)}px` }
      );

      // 不同类型星星的动画
      this.tweens.add({
        targets: star,
        alpha: { from: 0.3, to: 1 },
        scale: { from: 0.8, to: 1.2 },
        duration: Phaser.Math.Between(1500, 3000),
        delay: Phaser.Math.Between(0, 2000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // 旋转动画
      this.tweens.add({
        targets: star,
        rotation: 2 * Math.PI,
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        ease: 'Linear'
      });
    }
  }

  private createActionButtons() {
    // 返回按钮 - 左上角
    const returnBtnSize = 50;
    const returnBtn = this.add.graphics();
    returnBtn.fillGradientStyle(0x5C6BC0, 0x5C6BC0, 0x3F51B5, 0x303F9F, 1);
    returnBtn.fillRoundedRect(20, 20, returnBtnSize * 2, returnBtnSize, 25);
    
    const returnShadow = this.add.graphics();
    returnShadow.fillStyle(0x000000, 0.2);
    returnShadow.fillRoundedRect(22, 22, returnBtnSize * 2, returnBtnSize, 25);
    
    returnBtn.setInteractive(new Phaser.Geom.Rectangle(20, 20, returnBtnSize * 2, returnBtnSize), Phaser.Geom.Rectangle.Contains);

    const returnText = this.add.text(70, 45, '🏠 返回', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.025}px`,
      color: '#ffffff',
      fontStyle: 'bold',
      shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 2, fill: true }
    }).setOrigin(0.5);

    // 底部操作按钮区域 - 重新计算防止重叠
    const buttonY = this.scale.height * 0.88;
    const buttonHeight = 45;
    const buttonMargin = 8; // 按钮间隙
    const totalMargin = buttonMargin * 4; // 左右边距 + 两个按钮间隙
    const availableWidth = this.scale.width - totalMargin;
    const buttonWidth = Math.min(availableWidth / 3, 120); // 三等分可用宽度，最大120px
    
    // 计算按钮起始位置，确保居中且不重叠
    const startX = (this.scale.width - (buttonWidth * 3 + buttonMargin * 2)) / 2;

    // 保存相册按钮
    const saveBtn = this.add.graphics();
    saveBtn.fillGradientStyle(0xFFB74D, 0xFFB74D, 0xFF9800, 0xF57C00, 1);
    saveBtn.fillRoundedRect(startX, buttonY, buttonWidth, buttonHeight, 25);
    
    const saveShadow = this.add.graphics();
    saveShadow.fillStyle(0x000000, 0.2);
    saveShadow.fillRoundedRect(startX + 2, buttonY + 2, buttonWidth, buttonHeight, 25);
    
    saveBtn.setInteractive(new Phaser.Geom.Rectangle(startX, buttonY, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

    const saveText = this.add.text(startX + buttonWidth/2, buttonY + buttonHeight / 2, '💾 保存相册', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.022}px`,
      color: '#ffffff',
      fontStyle: 'bold',
      shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 2, fill: true }
    }).setOrigin(0.5);

    // 查看详情按钮 - 中间
    const detailBtnX = startX + buttonWidth + buttonMargin;
    const detailBtn = this.add.graphics();
    detailBtn.fillGradientStyle(0xE91E63, 0xE91E63, 0xC2185B, 0xAD1457, 1);
    detailBtn.fillRoundedRect(detailBtnX, buttonY, buttonWidth, buttonHeight, 25);
    
    const detailShadow = this.add.graphics();
    detailShadow.fillStyle(0x000000, 0.2);
    detailShadow.fillRoundedRect(detailBtnX + 2, buttonY + 2, buttonWidth, buttonHeight, 25);
    
    detailBtn.setInteractive(new Phaser.Geom.Rectangle(detailBtnX, buttonY, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

    const detailText = this.add.text(detailBtnX + buttonWidth/2, buttonY + buttonHeight / 2, '📋 查看详情', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.022}px`,
      color: '#ffffff',
      fontStyle: 'bold',
      shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 2, fill: true }
    }).setOrigin(0.5);

    // 加入日历按钮 - 右侧
    const calendarBtnX = startX + (buttonWidth + buttonMargin) * 2;
    const calendarBtn = this.add.graphics();
    calendarBtn.fillGradientStyle(0x66BB6A, 0x66BB6A, 0x4CAF50, 0x388E3C, 1);
    calendarBtn.fillRoundedRect(calendarBtnX, buttonY, buttonWidth, buttonHeight, 25);
    
    const calendarShadow = this.add.graphics();
    calendarShadow.fillStyle(0x000000, 0.2);
    calendarShadow.fillRoundedRect(calendarBtnX + 2, buttonY + 2, buttonWidth, buttonHeight, 25);
    
    calendarBtn.setInteractive(new Phaser.Geom.Rectangle(calendarBtnX, buttonY, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

    const calendarText = this.add.text(calendarBtnX + buttonWidth/2, buttonY + buttonHeight / 2, '📅 加入日历', {
      fontSize: `${Math.min(this.scale.width, this.scale.height) * 0.022}px`,
      color: '#ffffff',
      fontStyle: 'bold',
      shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 2, fill: true }
    }).setOrigin(0.5);

    // 按钮交互
    saveBtn.on('pointerdown', () => this.saveToAlbum());
    returnBtn.on('pointerdown', () => this.returnToHome());
    detailBtn.on('pointerdown', () => this.showConsensusDetails());
    calendarBtn.on('pointerdown', () => this.addToCalendar());

    // 按钮点击效果
    saveBtn.on('pointerover', () => {
      this.tweens.add({
        targets: saveBtn,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        ease: 'Power2.easeOut'
      });
    });

    saveBtn.on('pointerout', () => {
      this.tweens.add({
        targets: saveBtn,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Power2.easeOut'
      });
    });

    // 返回按钮悬停效果
    returnBtn.on('pointerover', () => {
      this.tweens.add({
        targets: returnBtn,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        ease: 'Power2.easeOut'
      });
    });

    returnBtn.on('pointerout', () => {
      this.tweens.add({
        targets: returnBtn,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Power2.easeOut'
      });
    });

    // 详情按钮悬停效果
    detailBtn.on('pointerover', () => {
      this.tweens.add({
        targets: detailBtn,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        ease: 'Power2.easeOut'
      });
    });

    detailBtn.on('pointerout', () => {
      this.tweens.add({
        targets: detailBtn,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Power2.easeOut'
      });
    });

    calendarBtn.on('pointerover', () => {
      this.tweens.add({
        targets: calendarBtn,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        ease: 'Power2.easeOut'
      });
    });

    calendarBtn.on('pointerout', () => {
      this.tweens.add({
        targets: calendarBtn,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Power2.easeOut'
      });
    });

    // 按钮入场动画
    [saveShadow, saveBtn, saveText].forEach((element, index) => {
      element.setAlpha(0);
      this.tweens.add({
        targets: element,
        alpha: 1,
        y: element.y - 10,
        duration: 600,
        delay: 1500 + index * 100,
        ease: 'Back.easeOut'
      });
    });

    // 返回按钮入场动画 - 左上角
    [returnShadow, returnBtn, returnText].forEach((element, index) => {
      element.setAlpha(0);
      this.tweens.add({
        targets: element,
        alpha: 1,
        x: element.x - 10,
        duration: 600,
        delay: 800 + index * 100,
        ease: 'Back.easeOut'
      });
    });

    // 详情按钮入场动画
    [detailShadow, detailBtn, detailText].forEach((element, index) => {
      element.setAlpha(0);
      this.tweens.add({
        targets: element,
        alpha: 1,
        y: element.y - 10,
        duration: 600,
        delay: 1600 + index * 100,
        ease: 'Back.easeOut'
      });
    });

    [calendarShadow, calendarBtn, calendarText].forEach((element, index) => {
      element.setAlpha(0);
      this.tweens.add({
        targets: element,
        alpha: 1,
        y: element.y - 10,
        duration: 600,
        delay: 1700 + index * 100,
        ease: 'Back.easeOut'
      });
    });
  }

  private showConsensusDetails() {
    console.log('📋 显示共识详情');
    // 触发查看详情事件，跳转到共识结果页面
    if (this.eventCallback) {
      this.eventCallback('showConsensusResult', {
        consensusTheme: this.victoryData?.consensusTheme,
        characters: this.victoryData?.characters,
        consensusResults: this.victoryData?.consensusResults
      });
    }
    // 如果没有回调，也可以直接跳转或显示详情
    else {
      console.log('🔗 准备跳转到共识详情页面...');
      // 这里可以通过其他方式跳转到详情页面
    }
  }

  private saveToAlbum() {
    console.log('💾 保存到相册');
    // 实现保存功能
  }

  private addToCalendar() {
    console.log('📅 添加到日历');
    // 实现日历功能
  }

  private returnToHome() {
    console.log('🏠 返回主页');
    // 触发返回主页事件
    if (this.eventCallback) {
      this.eventCallback('returnToHome');
    }
    // 如果没有回调，直接重启场景
    else {
      this.scene.start('LoadingScene');
    }
  }

  // 设置事件回调
  setEventCallback(callback: (event: string, data?: any) => void) {
    this.eventCallback = callback;
  }
}