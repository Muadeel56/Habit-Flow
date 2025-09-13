import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

interface EmailRequest {
  to: string;
  subject: string;
  habitTitle: string;
  habitDescription?: string;
  type: 'reminder' | 'streak' | 'weekly_report';
  streakCount?: number;
  userName?: string;
}

serve(async req => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers':
          'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    // Verify the request is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const emailRequest: EmailRequest = await req.json();
    const {
      to,
      subject,
      habitTitle,
      habitDescription,
      type,
      streakCount,
      userName,
    } = emailRequest;

    // Validate required fields
    if (!to || !subject || !habitTitle || !type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate email content based on type
    let htmlContent = '';
    let textContent = '';

    switch (type) {
      case 'reminder':
        htmlContent = generateReminderEmail(
          habitTitle,
          habitDescription,
          userName
        );
        textContent = `Hi ${userName || 'there'}!\n\nDon't forget to complete your habit: ${habitTitle}\n\n${habitDescription || ''}\n\nKeep up the great work!\n\nBest regards,\nHabit Flow Team`;
        break;

      case 'streak':
        htmlContent = generateStreakEmail(
          habitTitle,
          streakCount || 0,
          userName
        );
        textContent = `Congratulations ${userName || 'there'}!\n\nYou've achieved a ${streakCount}-day streak with "${habitTitle}"!\n\nThis is an amazing accomplishment. Keep up the fantastic work!\n\nBest regards,\nHabit Flow Team`;
        break;

      case 'weekly_report':
        htmlContent = generateWeeklyReportEmail(userName);
        textContent = `Hi ${userName || 'there'}!\n\nHere's your weekly habit progress report.\n\nCheck out your dashboard to see your detailed progress!\n\nBest regards,\nHabit Flow Team`;
        break;

      default:
        return new Response(JSON.stringify({ error: 'Invalid email type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }

    // Send email using Resend
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Habit Flow <noreply@habitflow.app>',
        to: [to],
        subject: subject,
        html: htmlContent,
        text: textContent,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('Resend API error:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const emailData = await emailResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        messageId: emailData.id,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

function generateReminderEmail(
  habitTitle: string,
  habitDescription?: string,
  userName?: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Habit Reminder</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px 20px; border: 1px solid #e2e8f0; }
            .habit-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; border-radius: 0 0 8px 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎯 Time for Your Habit!</h1>
                <p>Don't break the chain</p>
            </div>
            <div class="content">
                <p>Hi ${userName || 'there'}!</p>
                
                <p>This is your friendly reminder to complete your habit for today:</p>
                
                <div class="habit-card">
                    <h2 style="margin: 0 0 10px 0; color: #1e293b;">${habitTitle}</h2>
                    ${habitDescription ? `<p style="margin: 0; color: #64748b;">${habitDescription}</p>` : ''}
                </div>
                
                <p>Remember, consistency is key to building lasting habits. Even small progress counts!</p>
                
                <a href="${Deno.env.get('SITE_URL') || 'https://habitflow.app'}/habits" class="cta-button">
                    Mark as Complete
                </a>
                
                <p>Keep up the great work! 💪</p>
            </div>
            <div class="footer">
                <p>You're receiving this because you have habit reminders enabled.</p>
                <p><a href="${Deno.env.get('SITE_URL') || 'https://habitflow.app'}/profile">Manage notification preferences</a></p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateStreakEmail(
  habitTitle: string,
  streakCount: number,
  userName?: string
): string {
  const emoji =
    streakCount >= 100
      ? '🏆'
      : streakCount >= 30
        ? '🔥'
        : streakCount >= 7
          ? '⚡'
          : '🌟';

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Streak Achievement!</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px 20px; border: 1px solid #e2e8f0; }
            .achievement { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
            .streak-number { font-size: 48px; font-weight: bold; color: #f59e0b; margin: 10px 0; }
            .cta-button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; border-radius: 0 0 8px 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>${emoji} Streak Achievement!</h1>
                <p>You're on fire!</p>
            </div>
            <div class="content">
                <p>Congratulations ${userName || 'there'}!</p>
                
                <div class="achievement">
                    <div class="streak-number">${streakCount}</div>
                    <h2 style="margin: 10px 0; color: #92400e;">Day Streak</h2>
                    <p style="margin: 0; color: #92400e; font-weight: 500;">${habitTitle}</p>
                </div>
                
                <p>This is an incredible achievement! You've shown remarkable consistency and dedication.</p>
                
                <p>Streaks like this don't happen by accident - they're the result of your commitment to personal growth. Keep up the fantastic work!</p>
                
                <a href="${Deno.env.get('SITE_URL') || 'https://habitflow.app'}/habits" class="cta-button">
                    View Your Progress
                </a>
                
                <p>Here's to many more days of success! 🎉</p>
            </div>
            <div class="footer">
                <p>You're receiving this because you have achievement notifications enabled.</p>
                <p><a href="${Deno.env.get('SITE_URL') || 'https://habitflow.app'}/profile">Manage notification preferences</a></p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateWeeklyReportEmail(userName?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weekly Habit Report</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px 20px; border: 1px solid #e2e8f0; }
            .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; border-radius: 0 0 8px 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📊 Weekly Habit Report</h1>
                <p>Your progress summary</p>
            </div>
            <div class="content">
                <p>Hi ${userName || 'there'}!</p>
                
                <p>Here's your weekly habit progress report. See how you've been doing and discover areas for improvement.</p>
                
                <a href="${Deno.env.get('SITE_URL') || 'https://habitflow.app'}/dashboard" class="cta-button">
                    View Detailed Report
                </a>
                
                <p>Remember, progress isn't always linear. Every step forward counts, no matter how small!</p>
                
                <p>Keep building those positive habits! 🌱</p>
            </div>
            <div class="footer">
                <p>You're receiving this because you have weekly reports enabled.</p>
                <p><a href="${Deno.env.get('SITE_URL') || 'https://habitflow.app'}/profile">Manage notification preferences</a></p>
            </div>
        </div>
    </body>
    </html>
  `;
}
