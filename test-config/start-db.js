import { exec, spawn } from 'child_process';
import chalk from 'chalk';
import Table from 'cli-table3';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Utility function to log messages with timestamps
function logWithTime(message, color = 'blue') {
  const timestamp = new Date().toLocaleTimeString();
  console.log(chalk[color](`[${timestamp}] ${message}`));
}

// Function to execute a command and log the output
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(chalk.red(`Error: ${stderr}`));
      } else {
        resolve(stdout);
      }
    });
  });
}

// Function to wait for a specified amount of time
async function wait(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

// Function to get the Docker container ID for PostgreSQL
async function getPostgresContainerId() {
  try {
    const containerId = await executeCommand('docker ps -qf "name=postgres"');
    return containerId.trim(); // Trim extra spaces or newlines
  } catch (error) {
    logWithTime('Error retrieving PostgreSQL container ID', 'red');
    throw new Error('Failed to retrieve PostgreSQL container ID.');
  }
}

// Check if Docker containers are already running
async function areContainersRunning() {
  try {
    const statusOutput = await executeCommand('docker-compose ps');
    return statusOutput.includes('Up'); // Check if any containers are up
  } catch (error) {
    logWithTime('Error checking Docker containers status', 'red');
    return false;
  }
}

// Function to start the Docker container
async function startDockerCompose() {
  logWithTime('Checking Docker Compose status...', 'blue');

  const containersRunning = await areContainersRunning();
  if (containersRunning) {
    logWithTime('Docker containers are already running. Skipping start.', 'yellow');
    return;
  }

  logWithTime('Starting Docker Compose...', 'blue');
  await wait(1000); // Wait for 1 second

  try {
    const startOutput = await executeCommand('docker-compose up -d');
    logWithTime('Docker Compose started successfully!', 'green');
    await wait(500); // Wait for half a second
    console.log(chalk.grey(startOutput));
  } catch (error) {
    logWithTime(`Error starting Docker Compose: ${error}`, 'red');
  }
}

// Function to stop and remove Docker containers
async function stopDockerCompose() {
  logWithTime('Stopping Docker Compose...', 'blue');
  await wait(1000); // Wait for 1 second

  try {
    const stopOutput = await executeCommand('docker-compose down');
    logWithTime('Docker Compose stopped and removed successfully!', 'green');
    await wait(500); // Wait for half a second
    console.log(chalk.grey(stopOutput));
  } catch (error) {
    logWithTime(`Error stopping Docker Compose: ${error}`, 'red');
  }
}

// Function to display a decorated table of service statuses
async function displayLogs() {
  const table = new Table({
    head: [chalk.blue('Service'), chalk.blue('Status')],
    colWidths: [20, 20],
  });

  // Add row data for services
  table.push(
    [chalk.white('Postgres'), chalk.green('Running')],
    [chalk.white('Company'), chalk.cyan('Your Company Name')],
    [chalk.white('Copyright'), chalk.magenta('© 2024 Your Company Name')]
  );

  logWithTime('Docker Compose Services Status:', 'yellow');
  await wait(500); // Wait for half a second before displaying the table
  console.log(table.toString());
}

// Function to stream Docker logs with better formatting
function streamDockerLogs() {
  const logProcess = spawn('docker-compose', ['logs', '-f']);

  logProcess.stdout.on('data', (data) => {
    // Log Docker logs with decoration
    logWithTime(data.toString().trim(), 'grey');
  });

  logProcess.stderr.on('data', (data) => {
    logWithTime(data.toString().trim(), 'red');
  });

  logProcess.on('exit', (code) => {
    logWithTime(`Docker logs process exited with code ${code}`, 'yellow');
  });

  return logProcess;
}

// Main function to handle the entire flow
async function main() {
  try {
    await startDockerCompose();
    await displayLogs();

    // Stream Docker logs in a separate process
    const logProcess = streamDockerLogs();

    // Let the logs stream for a specific duration (e.g., 5 seconds) before stopping them
    await wait(5000); // Wait for 5 seconds

    logWithTime('Stopping Docker logs...', 'yellow');
    logProcess.kill(); // Stop the logs process

    // Handle termination signals to gracefully stop the Docker containers
    const cleanup = async () => {
      await stopDockerCompose();
      process.exit();
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

  } catch (error) {
    logWithTime(`Error: ${error}`, 'red');
  }
}

// Execute the main function
main().catch((err) => logWithTime(`Uncaught Error: ${err}`, 'red'));