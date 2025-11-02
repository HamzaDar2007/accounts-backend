import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  SetMetadata,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

export const Public = () => SetMetadata('isPublic', true);

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register new company with owner user' })
  @ApiBody({
    type: RegisterDto,
    examples: {
      uae: {
        summary: 'UAE Company Registration',
        value: {
          email: 'owner@company.com',
          password: 'SecurePass123!',
          firstName: 'Ahmed',
          lastName: 'Al-Rashid',
          companyName: 'Al-Rashid Trading LLC',
          country: 'UAE',
          trn: '100000000000003',
          address: '123 Business Bay, Dubai',
          phone: '+971501234567',
          language: 'en',
        },
      },
      ksa: {
        summary: 'KSA Company Registration',
        value: {
          email: 'owner@company.sa',
          password: 'SecurePass123!',
          firstName: 'Mohammed',
          lastName: 'Al-Saud',
          companyName: 'Al-Saud Company Ltd',
          country: 'KSA',
          trn: '300000000000003',
          address: 'King Fahd Road, Riyadh',
          phone: '+966501234567',
          language: 'ar',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'Company and user registered successfully, returns access and refresh tokens',
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'owner@company.com',
        firstName: 'Ahmed',
        lastName: 'Al-Rashid',
        role: 'owner',
        company: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'Al-Rashid Trading LLC',
          country: 'UAE',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    type: LoginDto,
    examples: {
      login: {
        summary: 'User Login',
        value: {
          email: 'owner@company.com',
          password: 'SecurePass123!',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns access and refresh tokens',
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'owner@company.com',
        firstName: 'Ahmed',
        lastName: 'Al-Rashid',
        role: 'owner',
        company: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'Al-Rashid Trading LLC',
          country: 'UAE',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile returned successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'User logout' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          description: 'Refresh token to blacklist',
        },
      },
    },
    required: false,
  })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
    @Body() body: { refreshToken?: string } = {},
  ) {
    // Extract access token from header
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(' ')[1];

    return this.authService.logout(user.sub, accessToken, body.refreshToken);
  }
  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiBody({
    type: RefreshTokenDto,
    examples: {
      refresh: {
        summary: 'Refresh Token',
        value: {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description:
      'Token refreshed successfully, returns new access and refresh tokens',
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto.refreshToken);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({
    type: ForgotPasswordDto,
    examples: {
      forgot: {
        summary: 'Forgot Password',
        value: {
          email: 'owner@company.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset token generated',
    example: {
      message: 'Password reset token generated',
      resetToken: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
      expiresAt: '2024-01-15T15:30:00.000Z',
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiBody({
    type: ResetPasswordDto,
    examples: {
      reset: {
        summary: 'Reset Password',
        value: {
          token: 'reset-token-123456',
          password: 'NewSecurePass123!',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    example: {
      message: 'Password reset successfully',
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
  }

  @Public()
  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email address' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'verify-token-123456' },
      },
      required: ['token'],
    },
    examples: {
      verify: {
        summary: 'Verify Email',
        value: {
          token: 'verify-token-123456',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async verifyEmail(@Body() body: { token: string }) {
    return this.authService.verifyEmail(body.token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({ status: 200, description: 'User info returned successfully' })
  async getMe(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user.sub);
  }
}
