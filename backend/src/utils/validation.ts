import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './errors';
import { logger } from './logger';

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'email' | 'date' | 'uuid';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: string[];
  custom?: (value: any) => boolean | string;
}

export class Validator {
  private rules: ValidationRule[] = [];

  addRule(rule: ValidationRule): this {
    this.rules.push(rule);
    return this;
  }

  validate(data: any): { isValid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};

    for (const rule of this.rules) {
      const value = data[rule.field];
      const fieldErrors: string[] = [];

      if (rule.required && (value === undefined || value === null || value === '')) {
        fieldErrors.push(`${rule.field} is required`);
        continue;
      }

      if (value !== undefined && value !== null && value !== '') {
        if (rule.type) {
          switch (rule.type) {
            case 'string':
              if (typeof value !== 'string') {
                fieldErrors.push(`${rule.field} must be a string`);
              } else {
                if (rule.minLength !== undefined && value.length < rule.minLength) {
                  fieldErrors.push(`${rule.field} must be at least ${rule.minLength} characters`);
                }
                if (rule.maxLength !== undefined && value.length > rule.maxLength) {
                  fieldErrors.push(`${rule.field} must be at most ${rule.maxLength} characters`);
                }
              }
              break;
            case 'number':
              if (typeof value !== 'number' || isNaN(value)) {
                fieldErrors.push(`${rule.field} must be a number`);
              } else {
                if (rule.min !== undefined && value < rule.min) {
                  fieldErrors.push(`${rule.field} must be at least ${rule.min}`);
                }
                if (rule.max !== undefined && value > rule.max) {
                  fieldErrors.push(`${rule.field} must be at most ${rule.max}`);
                }
              }
              break;
            case 'boolean':
              if (typeof value !== 'boolean') {
                fieldErrors.push(`${rule.field} must be a boolean`);
              }
              break;
            case 'email':
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (typeof value !== 'string' || !emailRegex.test(value)) {
                fieldErrors.push(`${rule.field} must be a valid email`);
              }
              break;
            case 'date':
              const date = new Date(value);
              if (isNaN(date.getTime())) {
                fieldErrors.push(`${rule.field} must be a valid date`);
              }
              break;
            case 'uuid':
              const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
              if (typeof value !== 'string' || !uuidRegex.test(value)) {
                fieldErrors.push(`${rule.field} must be a valid UUID`);
              }
              break;
          }
        }

        if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
          fieldErrors.push(`${rule.field} format is invalid`);
        }

        if (rule.enum && !rule.enum.includes(value)) {
          fieldErrors.push(`${rule.field} must be one of: ${rule.enum.join(', ')}`);
        }

        if (rule.custom) {
          const customResult = rule.custom(value);
          if (customResult !== true) {
            fieldErrors.push(customResult as string);
          }
        }
      }

      if (fieldErrors.length > 0) {
        errors[rule.field] = fieldErrors;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export function validateBody(validator: Validator) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { isValid, errors } = validator.validate(req.body);

    if (!isValid) {
      logger.warn('Validation failed:', errors);
      return next(new ValidationError(JSON.stringify(errors)));
    }

    next();
  };
}

export function validateParams(validator: Validator) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { isValid, errors } = validator.validate(req.params);

    if (!isValid) {
      logger.warn('Parameter validation failed:', errors);
      return next(new ValidationError(JSON.stringify(errors)));
    }

    next();
  };
}

export function validateQuery(validator: Validator) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { isValid, errors } = validator.validate(req.query);

    if (!isValid) {
      logger.warn('Query validation failed:', errors);
      return next(new ValidationError(JSON.stringify(errors)));
    }

    next();
  };
}