import { exec } from 'child_process';

const execCommand = (command: string) => {
  return new Promise((res, rej) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        rej(err);
        return;
      }

      res(stdout);
    });
  });
};

export { execCommand };
