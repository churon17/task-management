/**
 * Feature
 */
class FriendsList{

    friends =  [];

    addFriend(name){
        this.friends.push(name);
        this.announceFriendship(name);
    }

    announceFriendship(name){
        console.log(`${name} is now a friend`);
    }

    removeFriend(name){
        const index = this.friends.indexOf(name);

        if(index === -1){
            throw new Error('friend not found');
        }

        this.friends.splice(index, 1);
    }   

}

/**
 * Test
 */
describe('Fiends', ()=>{

    let friendsList;

    beforeEach( () => {
        friendsList =  new FriendsList();
        /**
         * This repeat for everything
         */
    });

    it('Initializes friends list', ()=>{
        expect(friendsList.friends.length).toEqual(0);
    });

    it('Adds a friend to the list', ()=>{
        friendsList.addFriend('Jean');
        expect(friendsList.friends.length).toEqual(1);
    });

    it('Announces friendship', ()=>{
        friendsList.announceFriendship = jest.fn();
        expect(friendsList.announceFriendship).not.toHaveBeenCalled();
        friendsList.addFriend('Jean');
        expect(friendsList.announceFriendship).toHaveBeenCalledWith('Jean');
    });

    describe('RemoveFriend', ()=>{

        it('removes a friend from the list',()=>{
            friendsList.addFriend('Juan');
            expect(friendsList.friends[0]).toEqual('Juan');
            friendsList.removeFriend('Juan');
            expect(friendsList.friends[0]).toBeUndefined();
        });

        it('throws an error as firned does not exist', ()=>{
            expect(() => friendsList.removeFriend('Ariel')).toThrow(new Error('friend not found'));
        });
    })

});