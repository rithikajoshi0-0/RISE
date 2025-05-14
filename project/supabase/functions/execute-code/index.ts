import { createClient } from 'npm:@supabase/supabase-js@2.39.6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CodeExecutionRequest {
  projectId: string;
  language: string;
}

// Sandbox for executing HTML/CSS/JS code
const createSandbox = (html: string, css: string, js: string) => {
  const sandboxHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          /* Watermark */
          body::before {
            content: 'RISE Preview - Protected';
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 24px;
            color: rgba(0, 0, 0, 0.1);
            pointer-events: none;
            z-index: 9999;
            white-space: nowrap;
          }
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          try {
            // Sandbox the JS execution
            const execute = new Function(${js});
            execute();
          } catch (error) {
            console.error('Execution error:', error);
          }
        </script>
      </body>
    </html>
  `;

  return sandboxHtml;
};

// Execute Python code in a restricted environment
const executePython = async (code: string): Promise<string> => {
  try {
    const command = new Deno.Command('python3', {
      args: ['-c', code],
      stdout: 'piped',
      stderr: 'piped',
      env: {
        'PYTHONPATH': '/tmp',  // Restrict Python path
        'PATH': '/usr/bin'     // Restrict system access
      }
    });

    const { stdout, stderr } = await command.output();
    const output = new TextDecoder().decode(stdout);
    const error = new TextDecoder().decode(stderr);

    return error ? `Error: ${error}` : output;
  } catch (error) {
    return `Execution error: ${error.message}`;
  }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { projectId, language } = await req.json() as CodeExecutionRequest;

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch project code from database
    const { data: project, error } = await supabase
      .from('projects')
      .select('code_content')
      .eq('id', projectId)
      .single();

    if (error || !project) {
      throw new Error('Project not found');
    }

    let output: string;
    if (language === 'python') {
      output = await executePython(project.code_content);
    } else {
      // For HTML/CSS/JS projects
      const { html = '', css = '', js = '' } = JSON.parse(project.code_content);
      output = createSandbox(html, css, js);
    }

    return new Response(
      JSON.stringify({ output }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Content-Security-Policy': "default-src 'self'; script-src 'unsafe-eval'",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    );
  }
});