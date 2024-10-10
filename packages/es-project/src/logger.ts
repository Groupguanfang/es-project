import chalk from 'chalk'
import ora from 'ora'
import type { SearchResult } from './templates-resolver'

type InferArray<T> = T extends (infer U)[] ? U : never

export class Logger {
  static log<Message>(message: Message) {
    console.log(`${chalk.greenBright('✔')} ${chalk.green(message)}`)
    return true
  }

  static process<Message>(message: Message) {
    const spinner = ora(`${chalk.blue(message)}`).start()
    return {
      /** Complete the process with a success message. */
      succeed: (message: string) => {
        spinner.succeed(chalk.green(message))
        return true
      },
      /** Complete the process with a failure message. */
      fail: <Message>(message: Message) => {
        if (message instanceof Error)
          spinner.fail(chalk.red(message.stack || message.message))
        else
          spinner.fail(chalk.red(message))
        return true
      },
    }
  }

  static error<Message>(message: Message) {
    if (message instanceof Error)
      console.error(`${chalk.redBright('✖')} ${chalk.red(message.stack || message.message)}`)
    else
      console.error(`${chalk.redBright('✖')} ${chalk.red(message)}`)
    return true
  }

  static logPackageInfo<OtherInfo extends Record<string, string>>(packageInfo: InferArray<SearchResult['objects']>['package'], otherInfo?: OtherInfo) {
    console.log()
    console.log(`${chalk.greenBright('✔')} ${chalk.bold('Package name:')} ${chalk.blue(packageInfo.name)}`)
    console.log(`${chalk.greenBright('✔')} ${chalk.bold('Package description:')} ${chalk.blue(packageInfo.description || 'No description')}`)
    console.log(`${chalk.greenBright('✔')} ${chalk.bold('Package version:')} ${chalk.blue(packageInfo.version)}`)
    console.log(`${chalk.greenBright('✔')} ${chalk.bold('Package keywords:')} ${chalk.blue(packageInfo.keywords?.join(', ') || 'No keywords')}`)

    if (otherInfo) {
      for (const [key, value] of Object.entries(otherInfo))
        console.log(`${chalk.greenBright('✔')} ${chalk.green(key)}: ${value}`)
    }

    console.log()
    return true
  }
}
