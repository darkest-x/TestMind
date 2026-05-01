# 用户管理模块
# 提供用户管理功能
module TestMind
  class User
    attr_accessor :id, :username, :email, :password, :first_name, :last_name, :active

    def initialize(username, email, password, first_name = nil, last_name = nil, active = true)
      @id = nil
      @username = username
      @email = email
      @password = password
      @first_name = first_name
      @last_name = last_name
      @active = active
    end

    def full_name
      if @first_name && @last_name
        "#{@first_name} #{@last_name}"
      elsif @first_name
        @first_name
      elsif @last_name
        @last_name
      else
        @username
      end
    end
  end

  class UserManager
    def initialize
      @users = {}
      @next_id = 1
      @mutex = Mutex.new
    end

    # 根据ID查找用户
    def find_user_by_id(id)
      @mutex.synchronize do
        @users[id]
      end
    end

    # 获取所有用户
    def find_all_users
      @mutex.synchronize do
        @users.values
      end
    end

    # 创建新用户
    def create_user(user)
      return nil if user.email.nil? || user.email.empty?
      return nil unless valid_email?(user.email)

      @mutex.synchronize do
        user.id = @next_id
        @next_id += 1
        @users[user.id] = user
        user
      end
    end

    # 更新用户信息
    def update_user(id, user)
      return nil if id <= 0

      @mutex.synchronize do
        return nil unless @users.key?(id)

        user.id = id
        @users[id] = user
        user
      end
    end

    # 删除用户
    def delete_user(id)
      return false if id <= 0

      @mutex.synchronize do
        !!@users.delete(id)
      end
    end

    # 激活用户
    def activate_user(id)
      user = find_user_by_id(id)
      return false unless user

      user.active = true
      true
    end

    # 停用用户
    def deactivate_user(id)
      user = find_user_by_id(id)
      return false unless user

      user.active = false
      true
    end

    # 根据邮箱查找用户
    def find_user_by_email(email)
      @mutex.synchronize do
        @users.values.find { |user| user.email == email }
      end
    end

    # 根据用户名查找用户
    def find_user_by_username(username)
      @mutex.synchronize do
        @users.values.find { |user| user.username == username }
      end
    end

    # 搜索用户
    def search_users(keyword, options = {})
      search_username = options[:username] != false
      search_email = options[:email] != false
      search_name = options[:name] != false

      results = []
      lower_keyword = keyword.downcase

      @mutex.synchronize do
        @users.values.each do |user|
          match = false

          if search_username
            match = true if user.username.downcase.include?(lower_keyword)
          end

          if !match && search_email
            match = true if user.email.downcase.include?(lower_keyword)
          end

          if !match && search_name
            if user.first_name && user.first_name.downcase.include?(lower_keyword)
              match = true
            elsif user.last_name && user.last_name.downcase.include?(lower_keyword)
              match = true
            end
          end

          results << user if match
        end
      end

      results
    end

    # 批量创建用户
    def create_users_batch(users)
      created = []
      users.each do |user|
        created_user = create_user(user)
        created << created_user if created_user
      end
      created
    end

    # 批量删除用户
    def delete_users_batch(ids)
      deleted_count = 0
      ids.each do |id|
        deleted_count += 1 if delete_user(id)
      end
      deleted_count
    end

    # 获取活跃用户数量
    def active_user_count
      @mutex.synchronize do
        @users.values.count { |user| user.active }
      end
    end

    # 获取用户总数
    def total_user_count
      @mutex.synchronize do
        @users.size
      end
    end

    private

    def valid_email?(email)
      email =~ /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
    end
  end
end
