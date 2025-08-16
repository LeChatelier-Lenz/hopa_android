// Prompt模板管理中心

export { BackgroundPrompts, type BackgroundPromptParams } from './backgrounds';

// 未来可以添加更多prompt类型:
// export { CharacterPrompts } from './characters';
// export { EquipmentPrompts } from './equipment';
// export { MonsterPrompts } from './monsters';
// export { QuestionPrompts } from './questions';

export class PromptManager {
  // 统一的prompt处理方法
  static processTemplate(template: string, params: Record<string, any>): string {
    let processed = template;
    
    // 替换变量
    Object.entries(params).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      processed = processed.replace(new RegExp(placeholder, 'g'), String(value));
    });
    
    return processed.trim();
  }

  // 验证prompt长度
  static validatePrompt(prompt: string): { valid: boolean; message?: string } {
    if (prompt.length < 10) {
      return { valid: false, message: 'Prompt太短，至少需要10个字符' };
    }
    
    if (prompt.length > 2000) {
      return { valid: false, message: 'Prompt太长，最多支持2000个字符' };
    }
    
    return { valid: true };
  }

  // 清理和优化prompt
  static optimizePrompt(prompt: string): string {
    return prompt
      .replace(/\s+/g, ' ')  // 合并多个空格
      .replace(/\n\s*\n/g, '\n')  // 合并多个换行
      .trim();
  }
}

export default PromptManager;