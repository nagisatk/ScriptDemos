/**
 * generic-words.ts
 * A JavaScript Generic Algorithm Demo By TypeScript
 * @authors Nagisa (nagisa_tk@outlook.com)
 * @date    2017-06-08 12:25:33
 * @version 0.9
 */

let alphas = "1234567890 abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.><!'\",`~@#$%^&*()-_=+\\|}{[];:?/"
// let alphas = "abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ,.?:;'\"!"
// let alphas = "|VDg4suMX9`,%@-_6:YrwBL#J=Q()i ]21KWCT0Ee}Ik~A5\\G+p'a;<bdR>F*qZS.!hz8\"l7vHjU?cnt{[f&^xNmyOoP3$/"
let len = alphas.length
let random_alphas = ""
while (random_alphas.length < len) {
    let x = alphas[Math.floor(Math.random() * len - 1) + 1]
    if (random_alphas.indexOf(x) === -1)
        random_alphas += x
}
alphas = random_alphas


class Member {
    code: string
    eval: number
    constructor(code : string) {
        this.code = code
        this.eval = 0
    }
    mate(other: Member) {
        let mid = Math.floor(this.code.length / 2)
        let child1 = this.code.substr(0, mid) + other.code.substr(mid)
        let child2 = other.code.substr(0, mid) + this.code.substr(mid)
        return [new Member(child1), new Member(child2)]
    }
    equals(other: Member) {
        return this.code === other.code
    }
}

class Group {
    goal: string
    members: Member[] = []
    genes: string = alphas
    mutation_rate: number = 0.3
    constructor(goal: string, size: number = 10) {
        this.goal = goal
        while(this.members.length < size) {
            this.members.push(this.born())
        }
        this.evaluate_members()
        this.sort_by_eval()
    }
    set_genes(genes: string) {
        this.genes = genes
    }
    set_mutation_rate(rate: number) {
        if(rate >= 1) {
            console.log('Bad rate')
            return
        }
        this.mutation_rate = rate
    }
    size() {
        return this.members.length
    }
    born() {
        let new_code = ''
        while (new_code.length < this.goal.length) {
            new_code += this.genes[Math.floor(Math.random() * this.genes.length)]
        }
        return new Member(new_code)
    }
    mutate() {
        for (let m of this.members) {
            if (Math.random() < this.mutation_rate) {
                let index = Math.floor(Math.random() * (m.code.length))
                let front = m.code.substr(0, index)
                let inalphas = this.genes.indexOf(m.code[index])
                let change = 0
                if (inalphas === 0) {
                    change = 1
                } else if (inalphas === this.genes.length - 1) {
                    change = -1
                } else {
                    change = Math.random() > 0.5 ? -1 : 1
                }
                let mid = this.genes[inalphas + change]
                let end = m.code.substr(index + 1)
                m.code = front + mid + end
            }
        }
    }
    evaluate_members() {
        for(let mem of this.members) {
            mem.eval = 0
            for (let i = 0; i < this.goal.length; i ++) {
                let div = this.genes.indexOf(mem.code[i]) - this.genes.indexOf(this.goal[i])
                mem.eval += (div * div)
            }
        }
    }
    sort_by_eval() {
        this.members.sort(function(a: Member, b: Member) {
            return a.eval - b.eval
        })
    }
    propagate() {
        this.mutate()
        let size = this.size()
        let index = Math.floor(Math.random() * size)
        let new_mems = this.members[0].mate(this.members[index]).concat(this.members)
        this.members = []
        for(let new_mem of new_mems) {
            let not_in_memebers = true
            for(let old_mem of this.members) {
                if(new_mem.equals(old_mem)) {
                    not_in_memebers = false
                }
            }
            if(not_in_memebers) {
                this.members.push(new_mem)
            }
        }
        while(this.size() < size) {
            this.members.push(this.born())
        }

        this.evaluate_members()
        this.sort_by_eval()
        if (this.size() > size) {
            this.members = this.members.slice(0, size)
        }
    }
}
